import { asyncConvolve } from "./asyncConvolve";
import { Control } from './runner'
import * as math from 'mathjs'

export function* convolve(
  img: ImageData,
  kernel: number[][],
) {
  const splited = split(kernel)
  if (splited) {
    let it = asyncConvolve(img, splited.rowKernel);
    let progress = 0
    let r = it.next(yield progress)

    while (true) {
      if (r.done) {
        break
      } else {
        progress = r.value
      }
      r = it.next(yield progress * 0.5)
    }
    it = asyncConvolve(r.value!, splited.colKernel);
    r = it.next(yield 0.5)
    while (true) {
      if (r.done) {
        break
      } else {
        progress = r.value
      }
      r = it.next(yield (progress * 0.5) + 0.5)
    }

    return new ImageData(
      new Uint8ClampedArray(r.value!.data),
      img.width,
      img.height,
    )
  }
  return yield* asyncConvolve(img, kernel)
}

function split(kernel: number[][]) {
  function trySplit(kernel: number[][]) {
    let rowIdx = 0;
    let colIdx = 0;
    let width = kernel[0].length;
    let height = kernel.length;
    let nonZero = false;
    outer:
    while (colIdx < height) {
      rowIdx = 0
      while (rowIdx < width) {
        rowIdx++;
        if (kernel[colIdx][rowIdx] !== 0) {
          nonZero = true
          break outer;
        }
      }
      colIdx++
    }
    if (nonZero) {
      const colKernel: number[][] = []
      for (const rowVector of kernel) {
        colKernel.push([rowVector[colIdx]])
      }
      return {
        rowKernel: [kernel[rowIdx].map(i => i / kernel[rowIdx][colIdx])] as number[][],
        colKernel
      }
    }
    return null
  }
  const splited = trySplit(kernel)
  if (!splited) return null
  const k1 = math.matrix(kernel)
  const k2 = math.multiply(
    math.matrix(splited.colKernel),
    math.matrix(splited.rowKernel)
  )

  const m = math.equal(
    k1,
    k2
  ) as math.Matrix
  if (((m.toArray() as any) as boolean[][]).flat().every(i => i)) {
    return splited
  }
}

