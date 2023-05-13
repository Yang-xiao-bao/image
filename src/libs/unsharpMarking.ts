import { add, scale } from "./arithmetical";
import { convolve } from "./convolve";
import { gaussianFilter } from "./gaussian";

export function unsharpMarking(
  img: ImageData,
  sigma: number,
  k: number
) {
  const blurred = convolve(img, gaussianFilter(sigma));
  const mask = add(img, scale(blurred, -1))
  const result = add(img, scale(mask, k))
  return {
    blurred,
    mask,
    result
  }
}
