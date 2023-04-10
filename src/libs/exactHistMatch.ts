import { Channel } from "../types/image";
import { HistType } from "./hist";
import { create } from './mat'

const neighborMat = {
  4: create([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0]
  ])
    .scale(1 / 5)
    .get(),
  8: create([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
  ]).scale(1 / 9).get(),
  13: create([
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0]
  ]).scale(1 / 13).get(),
  21: create([
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0]
  ]).scale(1 / 21).get(),
  25: create([
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1]
  ]).scale(1 / 25).get()
}
const neighbors: Record<4 | 8 | 13 | 21 | 25, (4 | 8 | 13 | 21 | 25)[]> = {
  4: [4],
  8: [4, 8],
  13: [4, 8, 13],
  21: [4, 8, 13, 21],
  25: [4, 8, 13, 21, 25]
}

export function exactHistMatch(img: ImageData, hist: Omit<HistType, 'all'>, k: 4 | 8 | 13 | 21 | 25) {
  const r = ordering()
  const g = ordering()
  const b = ordering()

  function getIndensity(x: number, y: number, c: Omit<Channel, 'all'>, k: 4 | 8 | 13 | 21 | 25) {
    const neighbor = neighborMat[k]
    const center = Math.floor(neighbor.length / 2)
    const offset = c === 'r' ? 0 : c === 'g' ? 1 : 2
    let sum = 0
    for (let ny = 0; ny < neighbor.length; ny++) {
      for (let nx = 0; nx < neighbor[ny].length; nx++) {
        const px = x + nx - center
        const py = y + ny - center
        if (px >= 0 && px < img.width && py >= 0 && py < img.height) {
          const index = (py * img.width + px) * 4 + offset
          sum += img.data[index] * neighbor[ny][nx]
        }
      }
    }
    return sum
  }

  function calcIndensities(x: number, y: number, c: Omit<Channel, 'all'>) {
    const offset = c === 'r' ? 0 : c === 'g' ? 1 : 2
    const index = (y * img.width + x) * 4 + offset
    const values = [img.data[index]]
    for (let k1 of neighbors[k]) {
      values.push(
        getIndensity(x, y, c, k1)
      )
    }
    return values
  }

  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      r.insert({
        x, y,
        weight: calcWeight(calcIndensities(x, y, 'r'))
      })
      g.insert({
        x, y,
        weight: calcWeight(calcIndensities(x, y, 'g'))
      })
      b.insert({
        x, y,
        weight: calcWeight(calcIndensities(x, y, 'b'))
      })
    }
  }
  const result = new ImageData(
    new Uint8ClampedArray(img.data),
    img.width, img.height)
  let rIndex = 0
  let gIndex = 0
  let bIndex = 0
  for (let i = 0; i < 256; i++) {
    let count = hist.r[i]
    while (count-- > 0) {
      const { x, y } = r.ordering[rIndex++]
      const rInd = (y * img.width + x) * 4
      result.data[rInd] = i
    }
    count = hist.g[i]
    while (count-- > 0) {
      const { x, y } = g.ordering[gIndex++]
      const gInd = (y * img.width + x) * 4 + 1
      result.data[gInd] = i
    }
    count = hist.b[i]
    while (count-- > 0) {
      const { x, y } = b.ordering[bIndex++]
      const bInd = (y * img.width + x) * 4 + 2
      result.data[bInd] = i
    }

  }
  return result
}
type Ordering = {
  x: number,
  y: number,
  weight: number,
}
function ordering() {
  const ordering: Array<Ordering> = []
  function searchInsertPoint(w: number) {
    let l = 0
    let r = ordering.length - 1
    while (l <= r) {
      const mid = Math.floor((l + r) / 2)
      if (ordering[mid].weight === w) {
        return mid
      } else if (ordering[mid].weight > w) {
        r = mid - 1
      } else {
        l = mid + 1
      }
    }
    return l
  }
  function insert(o: Ordering) {
    const index = searchInsertPoint(o.weight)
    ordering.splice(index, 0, o)
  }
  return {
    insert,
    ordering
  }
}
// 一组像素灰度
function calcWeight(values: number[]) {
  /**
   * weigh t = v[0] + v[1] * 2^8 + v[1] * 2^9 ...
   * */
  let weight = values[0]
  let i = 7
  for (let j = 1; j < values.length; j++) {
    weight = weight + values[j] * 2 ** (j + i)
  }
  return weight
}
