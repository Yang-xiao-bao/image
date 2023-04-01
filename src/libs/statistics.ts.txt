import { hist, normalizeHist } from './hist'
export function statistics(image: ImageData) {
  const cdf = normalizeHist(hist(image), image.width * image.height)
  const mean = {
    r: cdf.r.reduce((a, b, i) => a + b * i, 0),
    g: cdf.g.reduce((a, b, i) => a + b * i, 0),
    b: cdf.b.reduce((a, b, i) => a + b * i, 0),
  }
  const variance = {
    r: cdf.r.reduce((a, b, i) => a + b * (i - mean.r) ** 2, 0),
    g: cdf.g.reduce((a, b, i) => a + b * (i - mean.g) ** 2, 0),
    b: cdf.b.reduce((a, b, i) => a + b * (i - mean.b) ** 2, 0),
  }
  return { mean, variance }
}
