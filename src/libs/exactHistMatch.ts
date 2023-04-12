import { Channel } from "../types/image";
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

/**
* 只考虑灰度图,因为直接对RGB个分量进行处理,会导致颜色不一致
* 对于RGB图，可以将其转换到HSL空间，然后对L分量进行处理，再转换回RGB空间
* */
export function exactHistMatch(img: ImageData, hist: Uint32Array, k: 1 | 4 | 8 | 13 | 21 | 25) {
  type Data = {
    x: number,
    y: number,
    weight: number,
  }
  const r = [] as Array<Data>;
  /*
    计算x,y处一个区域（由k指定）的平均亮度
  */
  function getIndensity(x: number, y: number, k: 4 | 8 | 13 | 21 | 25) {
    const neighbor = neighborMat[k]
    const center = Math.floor(neighbor.length / 2)
    let sum = 0
    for (let ny = 0; ny < neighbor.length; ny++) {
      for (let nx = 0; nx < neighbor[ny].length; nx++) {
        const px = x + nx - center
        const py = y + ny - center
        if (px >= 0 && px < img.width && py >= 0 && py < img.height) {
          const index = (py * img.width + px) * 4
          sum += img.data[index] * neighbor[ny][nx]
        }
      }
    }
    return sum
  }
  function calcIndensities(x: number, y: number) {
    const index = (y * img.width + x) * 4
    const values = [img.data[index]]
    if (k > 1) {
      // @ts-ignore
      for (let k1 of neighbors[k]) {
        values.push(
          getIndensity(x, y, k1)
        )
      }
    }
    return values
  }

  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      r.push({
        x, y,
        weight: calcWeight(calcIndensities(x, y))
      })
    }
  }
  const result = new ImageData(
    new Uint8ClampedArray(img.data),
    img.width, img.height)

  let rIndex = 0
  const rOrdering = r.sort((a, b) => a.weight - b.weight)

  for (let i = 0; i < 256; i++) {
    let count = hist[i]
    while (count-- > 0) {
      const { x, y } = rOrdering[rIndex++]
      const rInd = (y * img.width + x) * 4
      result.data[rInd] = i
      result.data[rInd + 1] = i
      result.data[rInd + 2] = i
    }
  }
  return result
}
// 一组像素灰度
function calcWeight(values: number[]) {
  values = values.reverse()
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
