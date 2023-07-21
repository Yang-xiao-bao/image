import { DFTData } from "./dft";
import { GrayImageData } from "./image";
import * as fftwHelper from "./fftw-helper";

export function fft(image: GrayImageData, shift = false): DFTData {
  const realData =
    new Float32Array(image.data)
  if (shift) {
    for (let x = 0; x < image.width; x++) {
      for (let y = 0; y < image.height; y++) {
        realData[y * image.width + x] = realData[y * image.width + x]
          * (-1) ** (x + y)
      }
    }
  }
  const [real, imag] = fftwHelper.fft(
    realData,
    new Float32Array(realData.length),
    image.width,
    image.height
  )
  return {
    width: image.width,
    height: image.height,
    real: real,
    imag: imag,
    shifted: shift
  }
}
export function ifft(data: DFTData) {
  const [real, image] = fftwHelper.ifft(data.real, data.imag, data.width, data.height)
  if (data.shifted) {
    for (let x = 0; x < data.width; x++) {
      for (let y = 0; y < data.height; y++) {
        real[y * data.width + x] = real[y * data.width + x]
          * (-1) ** (x + y)
      }
    }
  }
  return {
    width: data.width,
    height: data.height,
    data: real,
    hit: 'remap'
  } as GrayImageData
}


