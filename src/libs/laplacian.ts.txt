import { create } from './mat'
export function laplacianFilter(alpha = 0) {
  return create(
    [
      [alpha / 4, (1 - alpha) / 4, alpha / 4],
      [(1 - alpha) / 4, -1, (1 - alpha) / 4],
      [alpha / 4, (1 - alpha) / 4, alpha / 4],
    ]
  ).scale(4 / (alpha + 1))
    .get()
}
