import { DFTData } from "./dft";
import { ifft } from "./fft";
import { GrayImageData } from "./image";

export function dftSpectrum(data: DFTData, log = false) {
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

export function recontructBySpectrum(data: DFTData): GrayImageData {
  const spectruc = dftSpectrum(data)
  const img = ifft({
    ...data,
    real: spectruc.data,
    imag:  new Float32Array(data.width * data.height)
  })
  for(let i  = 0;i<img.data.length;i++) {
    if(img.data[i]>0) {
      img.data[i] = Math.log(1+img.data[i])
    }
  }
  return img
}
