import { DFTData } from "./dft";
import { GrayImageData } from "./image";

export function dftSpecrum(data: DFTData, log = false) {
  const { width, height, real, imag } = data
  const specrum = new Float32Array(width * height)
  if (log) {
    for (let i = 0; i < specrum.length; i++) {
      specrum[i] = Math.log(1 + Math.sqrt(real[i] * real[i] + imag[i] * imag[i]))
    }
  } else {
    for (let i = 0; i < specrum.length; i++) {
      specrum[i] = Math.sqrt(real[i] * real[i] + imag[i] * imag[i])
    }
  }

  return {
    width,
    height,
    data: specrum,
    hit: 'remap'
  } as GrayImageData
}
