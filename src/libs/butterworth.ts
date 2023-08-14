import { GrayImageData } from "./image";

export function butterworth(width: number, height: number, radius: number, n: number): GrayImageData {
  const result: GrayImageData = {
    width,
    height,
    data: new Float32Array(width * height),
    hit:'remap'
  }
  const cx = width / 2 | 0
  const cy = height / 2 | 0
  for (let col = 0; col < width; col++) {
    for (let row = 0; row < height; row++) {
      let x = col - cx
      let y = row - cy
      let index = row * width + col
      const d = Math.sqrt((x ) ** 2 + (y) ** 2)
      result.data[index] = 1 / (1 + (d / radius) ** (2 * n))
    }
  }

  return result
}
