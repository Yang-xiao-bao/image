import { ones } from './mat'
export function boxFilter(n: number) {
  return ones(n, n).scale(1 / (n * n))
}
