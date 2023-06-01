import ndarray from "ndarray";
import ndfft from 'ndarray-fft';
import { DFTData } from "./dft";
import { GrayImageData } from "./image";
import { Buffer } from 'buffer'
// Fix ndarray-fft
(globalThis as any).global = globalThis;
(globalThis as any).Buffer = Buffer

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
  const real = ndarray(
    realData,
    [image.width, image.height]
  )
  const imag = ndarray(
    new Float32Array(image.width * image.height),
    [image.width, image.height]
  )
  ndfft(1, real, imag)
  return {
    width: image.width,
    height: image.height,
    real: real.data,
    imag: imag.data,
    shifted: shift
  }
}
export function ifft(data: DFTData) {
  const real = ndarray(
    new Float32Array(data.real),
    [data.width, data.height]
  )
  const imag = ndarray(
    new Float32Array(data.imag),
    [data.width, data.height]
  )
  ndfft(-1, real, imag)
  if (data.shifted) {
    for (let x = 0; x < data.width; x++) {
      for (let y = 0; y < data.height; y++) {
        real.data[y * data.width + x] = real.data[y * data.width + x]
          / (-1) ** (x + y)
      }
    }
  }
  return {
    width: data.width,
    height: data.height,
    data: real.data,
    hit: 'remap'
  } as GrayImageData
}
