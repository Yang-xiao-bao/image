export function hist(data: ImageData) {
  const r = new Uint32Array(256)
  const g = new Uint32Array(256)
  const b = new Uint32Array(256)
  for (let i = 0; i < data.data.length; i += 4) {
    r[data.data[i]] = r[data.data[i]] + 1
    g[data.data[i + 1]] = g[data.data[i + 1]] + 1
    b[data.data[i + 2]] = b[data.data[i + 2]] + 1
  }
  const all = new Uint32Array(256)
  for (let i = 0; i < all.length; i++) {
    all[i] = r[i] + g[i] + b[i]
  }
  return { r, g, b, all }
}

export function cumulativeHist(data: ImageData) {
  const { r, g, b, all } = hist(data)
  for (let i = 1; i < r.length; i++) {
    r[i] = r[i - 1] + r[i]
    g[i] = g[i - 1] + g[i]
    b[i] = b[i - 1] + b[i]
    all[i] = all[i - 1] + all[i]
  }
  return { r, g, b, all }
}

export function normalizeHist(hist: { r: Uint32Array, g: Uint32Array, b: Uint32Array, all: Uint32Array },
  /**
* 注意这里的size是指像素的个数，而不是字节数
* 对于CumulativeHist来说，size 必须指定
* */
  size?: number) {
  if (size == null) {
    size = hist.r.reduce((a, b) => a + b, 0)
  }
  const r = new Float32Array(256)
  const g = new Float32Array(256)
  const b = new Float32Array(256)
  const all = new Float32Array(256)
  for (let i = 0; i < 256; i++) {
    r[i] = hist.r[i] / size
    g[i] = hist.g[i] / size
    b[i] = hist.b[i] / size
    all[i] = hist.all[i] / (3 * size)
  }
  return { r, g, b, all }
}
