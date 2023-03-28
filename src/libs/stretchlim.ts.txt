import { cumulativeHist } from "./hist"

/**
* 丢弃直方图两侧的部分像素
* 例如，tol = [0.01, 0.99]，则丢弃直方图两侧的1%的像素
* 分通道返回满足条件的最小灰度值和最大灰度值
* */
export function stretchlim(image: ImageData, tol = [0.01, 0.99]) {
  const [low, high] = tol
  const hist = cumulativeHist(image)
  const total = image.width * image.height
  const lowCount = Math.round(total * low)
  const highCount = Math.round(total * high)
  function lim(hist: Uint32Array) {
    let lowValue = 0
    let highValue = 0
    for (let i = 0; i < 256; i++) {
      if (hist[i] >= lowCount) {
        lowValue = i
        break
      }
    }
    for (let i = 0; i < 256; i++) {
      if (hist[i] >= highCount) {
        highValue = i
        break
      }
    }
    return [lowValue, highValue] as [number, number]
  }
  return {
    r: lim(hist.r),
    g: lim(hist.g),
    b: lim(hist.b)
  }
}
