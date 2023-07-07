import { GrayImageData } from "./image";

export function frequencyGuassianFilter(width: number, height: number, sigma = 1): GrayImageData {
  const ret: GrayImageData = {
    width,
    height,
    data: new Float32Array(width * height),
    hit: 'remap'
  }
  const cx = Math.floor(width / 2)
  const cy = Math.floor(height / 2)
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      let x = i - cx;
      let y = j - cy;
      ret.data[j * width + i] = Math.exp(
        -(x ** 2 + y ** 2)/ (2 * sigma ** 2)
      )
    }
  }
  return ret
}
