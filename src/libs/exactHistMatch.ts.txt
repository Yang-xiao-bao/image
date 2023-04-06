import { Channel } from "../types/image";
import { HistType } from "./hist";

export function exactHistMatch(img: ImageData, hist: Omit<HistType, 'all'>, k = 6) {
  const r = ordering()
  const g = ordering()
  const b = ordering()

  function calcIndensity(x: number, y: number, c: Omit<Channel, 'all'>) {
    //TODO
    return [] as number[]
  }

  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      r.insert({
        x, y,
        weight: calcWeight(calcIndensity(x, y, 'r'))
      })
      g.insert({
        x, y,
        weight: calcWeight(calcIndensity(x, y, 'g'))
      })
      b.insert({
        x, y,
        weight: calcWeight(calcIndensity(x, y, 'b'))
      })
    }
  }
  const result = new ImageData(img.width, img.height)
  for (let i = 0; i < r.ordering.length; i++) {
    {
      const { x, y } = r.ordering[i]
      const rInd = (y * img.width + x) * 4
      result.data[rInd] = 0 //TODO: find the value
    }
    {
      const { x, y } = g.ordering[i]
      const gInd = (y * img.width + x) * 4 + 1
      result.data[gInd] = 0 //TODO: find the value
    }
    {
      const { x, y } = g.ordering[i]
      const bInd = (y * img.width + x) * 4 + 2
      result.data[bInd] = 0 //TODO: find the value
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
   * weight = v[0] + v[1] * 2^8 + v[1] * 2^9 ...
   * */
  let weight = values[0]
  let i = 7
  for (let j = 1; j < values.length; j++) {
    weight = weight + values[j] * 2 ** (j + i)
  }
  return weight
}
