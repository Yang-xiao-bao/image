import { cumulativeHist, HistType, normalizeHist } from "./hist";

export function histMatch(img: ImageData, hist: Omit<HistType, 'all'>) {
  console.log("["+Array.from(hist.r).join(";")+"]")
  const result = new ImageData(img.width, img.height)
  const cdfr = normalizeHist(cumulativeHist(img), img.width * img.height)
  const cdfz = normalizeHist(cumulativeHist({ ...hist, all: new Uint32Array(256) }), hist.r.reduce((a, b) => a + b, 0))
  // r --> s
  const tr = (r: number, channel: 'r' | 'g' | 'b') => Math.round(255 * cdfr[channel][r])
  // z --> s
  const gz = (z: number, channel: 'r' | 'g' | 'b') => Math.round(255 * cdfz[channel][z])
  const rzsPairs = new Array(256)
    .fill(0)
    .map((_, i) => [gz(i, 'r'), i] as [number, number])
  rzsPairs.sort((a, b) => a[0] - b[0])
  const gzsPairs = new Array(256)
    .fill(0)
    .map((_, i) => [gz(i, 'g'), i] as [number, number])
  gzsPairs.sort((a, b) => a[0] - b[0])
  const bzsPairs = new Array(256)
    .fill(0)
    .map((_, i) => [gz(i, 'b'), i] as [number, number])
  gzsPairs.sort((a, b) => a[0] - b[0])
  function search(z: number, pairs: [number, number][]) {
    let l = 0
    let r = pairs.length - 1
    while (l < r) {
      const mid = Math.floor((l + r) / 2)
      if (pairs[mid][0] === z) {
        return pairs[mid][1]
      } else if (pairs[mid][0] > z) {
        r = mid
      } else {
        l = mid + 1
      }
    }
    return pairs[l][1]
  }

  for (let i = 0; i < img.data.length; i += 4) {
    const [r, g, b] = [img.data[i], img.data[i + 1], img.data[i + 2]]
    const sr = tr(r, 'r')
    const sg = tr(g, 'g')
    const sb = tr(b, 'b')
    // 找到zr,zg,zb, 使得 sr 与gz(zr), sg 与 gz(zg), sb 与 gz(zb)
    // 最接近
    const zr = search(sr, rzsPairs)
    const zg = search(sg, gzsPairs)
    const zb = search(sb, bzsPairs)
    result.data[i] = zr
    result.data[i + 1] = zg
    result.data[i + 2] = zb
    result.data[i + 3] = img.data[i + 3]
  }
  return result
}
