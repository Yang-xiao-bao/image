import { fft, ifft } from "./fft";
import { GrayImageData } from "./image";

export function dftFilter(
  img: GrayImageData, filter: GrayImageData, shift = false) {
  if (img.width !== filter.width || img.height !== filter.height) {
    throw new Error("Size mismatch")
  }
  const w = img.width + filter.width
  const h = img.height + filter.height
  img = padImage(img, w, h)
  filter = padImage(filter, w, h)
  const f = fft(img, shift)
  for (let i = 0; i < f.real.length; i++) {
    f.real[i] = f.real[i] * filter.data[i]
    f.imag[i] = f.imag[i] * filter.data[i]
  }
  const result = ifft(f)
  return stripPadding(result, img.width, img.height)
}
function stripPadding(img: GrayImageData, width: number, height: number): GrayImageData {
  const data = new Float32Array(width * height)
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      data[y * width + x] = img.data[y * img.width + x]
    }
  }
  return {
    data,
    width,
    height,
    hit: img.hit
  }

}
function padImage(img: GrayImageData, width: number, height: number): GrayImageData {
  const data = new Float32Array(width * height)
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      data[y * width + x] = img.data[y * img.width + x]
    }
  }
  return {
    data,
    width,
    height,
    hit: img.hit
  }
}

