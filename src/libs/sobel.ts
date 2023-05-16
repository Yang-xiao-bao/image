import { add, pow } from "./arithmetical"
import { convolve } from "./convolve"

export function sobel(img: ImageData) {
  const a = convolve(img, [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
  ])
  const b = convolve(img, [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ])
  const c = pow(
    add(
      pow(a, 2),
      pow(b, 2)
    )
    , 1 / 2)
  return { a, b, c }
}
