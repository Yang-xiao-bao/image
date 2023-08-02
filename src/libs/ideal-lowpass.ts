import { GrayImageData } from "./image"

/**
 * 中心化的理想低通滤波器
 * 通俗来将就是一个图片，其中有一个半径为R的圆，圆内的像素值为1,
 * 圆外的像素值为0
 * 这使其和一个中心化的DFT数据相乘后只保留圆内的低频分量而完全
 * 衰减掉其它高频份量。
 * R被称为截止频率
 */
export function idealLowpassFilter(width: number, height: number, radius: number): GrayImageData {
  const data = new Float32Array(width * height)
  const cx = width / 2
  const cy = height / 2
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      data[y * width + x] = ((x - cx) ** 2 + (y - cy) ** 2) <= (radius ** 2) ? 1 : 0
    }
  }
  return {
    data,
    width,
    height,
    hit: 'remap'
  }
}
