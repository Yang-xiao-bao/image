import { hist, normalizeHist } from './hist'
export function statistics(image: ImageData) {
  const cdf = normalizeHist(hist(image), image.width * image.height)
  const mean = {
    r: cdf.r.reduce((a, b, i) => a + b * i, 0),
    g: cdf.g.reduce((a, b, i) => a + b * i, 0),
    b: cdf.b.reduce((a, b, i) => a + b * i, 0),
  }
  const variance = {
    r: cdf.r.reduce((a, p, ri) => a + p * (ri - mean.r) ** 2, 0),
    g: cdf.g.reduce((a, p, gi) => a + p * (gi - mean.g) ** 2, 0),
    b: cdf.b.reduce((a, p, bi) => a + p * (bi - mean.b) ** 2, 0)
  }
  return { mean, variance }
}
