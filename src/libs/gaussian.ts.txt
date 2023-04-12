import { create } from './mat'
export function arbitraryGaussianFilter(size: number, sigma: number): number[][] {
  const kernel = new Array(size)
    .fill(0)
    .map((_) => new Array(size).fill(0))
  const center = Math.floor(size / 2)
  let sum = 0
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const x = i - center
      const y = j - center
      //            ⎛ ⎛ 2    2⎞⎞
      //            ⎜-⎝x  + y ⎠⎟
      //            ⎜──────────⎟
      //            ⎜       2  ⎟
      //            ⎝  2 ⋅ ς   ⎠
      // h(x, y) = e            

      kernel[i][j] = Math.exp(-(x * x + y * y) / (2 * sigma * sigma))
      sum += kernel[i][j]
    }
  }
  return create(kernel).scale(1 / sum).get()
}
export function gaussianFilter(sigma: number): number[][] {
  const size = Math.ceil(6 * sigma)
  return arbitraryGaussianFilter(size, sigma)
}

