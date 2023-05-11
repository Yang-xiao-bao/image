import { add, scale } from "./arithmetical"
import { convolve } from "./convolve"

export function laplacianSharpening(img: ImageData,
  kernel: number[][],
  c: number
) {
  const convolveResult = convolve(img, kernel)
  // 对于Kernel 中心为负的情况，为何需要用原图减去(而非)卷积结果？
  // 假设c>0,kernel 中心点为负,
  // 如果该点亮度和周围点亮度差距不大，卷积的结果在0附近
  // 如果该点比周围的点亮度高，卷积的结果为负
  // 如果该点比周围的点亮度低，卷积的结果为正
  // 因此，原图减去卷积结果，使：平坦处变化不大，
  // 高亮处变得更高(正-负,变大)，低亮处变得更低(正-正，变小)
  // 原图加上卷积结果，使：平坦处变化不大，
  // 高亮处变得更暗(正+负，变小)，低亮处变得更亮(正+正，变大),对比度减小了
  const origionalMinusConvolveResult = add(img, scale(convolveResult, -c))
  const origionalAddConvolveResult = add(img, scale(convolveResult, c))
  return {
    convolveResult,
    origionalAddConvolveResult,
    origionalMinusConvolveResult
  }
}
