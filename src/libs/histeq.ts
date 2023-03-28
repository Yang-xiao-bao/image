import { cumulativeHist, normalizeHist } from "./hist";

// s = (L-1) * CDF
// 无论原图像的灰度分布如何，经过直方图均衡化后，灰度分布都会变得基本均匀、
// 且变换后的图像的CDF几乎为一个直角三角形
export function histeq(image: ImageData) {
  const cdf = normalizeHist(cumulativeHist(image), image.width * image.height)
  // rTrans[i] 表示将(红通道)灰度值为i的像素变换为灰度值为rTrans[i]的像素
  const rTrans: number[] = []
  const gTrans: number[] = []
  const bTrans: number[] = []
  for (let i = 0; i < 256; i++) {
    // cdf.r[i] = 灰度值小于等于i的像素的概率 
    // 直观的理解：原本较暗的图片，经过直方图均衡化后，变得更亮
    // 但是，如果原本的图片就很亮，那么经过直方图均衡化后，变得更亮的程度就不明显了
    // 因为，原本较暗的图像的CDF较快的达到1,而使得变换后的像素值都接近255
    rTrans[i] = Math.round(255 * cdf.r[i])
    gTrans[i] = Math.round(255 * cdf.g[i])
    bTrans[i] = Math.round(255 * cdf.b[i])
  }
  const result = new ImageData(image.width, image.height)
  for (let i = 0; i < image.data.length; i += 4) {
    result.data[i] = rTrans[image.data[i]]
    result.data[i + 1] = gTrans[image.data[i + 1]]
    result.data[i + 2] = bTrans[image.data[i + 2]]
    result.data[i + 3] = image.data[i + 3]
  }
  return result
}

