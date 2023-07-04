import { DFTData } from "./dft"
import { dftSpectrum } from "./dftSpectrum"
import { ifft } from "./fft"
import { GrayImageData } from "./image"
import { phaseAngle } from "./phaseAngle"
/**
 *                                          (j ⋅ φ(u, v))
F(u, v) = R(u, v) + j ⋅ I(u, v) = |F(u,v)|e            
φ(u, v) 为相角，
|F(u,v)|为频谱
 * */

// 只用频谱做逆FFT变换，即令F(u,v) = |F(u,v)|
export function recontructBySpectrum(data: DFTData): GrayImageData {
  const spectruc = dftSpectrum(data)
  const img = ifft({
    ...data,
    real: spectruc.data,
    imag: new Float32Array(data.width * data.height)
  })
  for (let i = 0; i < img.data.length; i++) {
    if (img.data[i] > 0) {
      img.data[i] = Math.log(1 + img.data[i])
    }
  }
  return img
}

// 只用相角，即令
//           (j ⋅ φ(u, v))
// F(u,v) = e            
export function recontructByPhaseAngle(data: DFTData) {
  const p = phaseAngle(data)
  const real = new Float32Array(data.width * data.height)
  const imag = new Float32Array(data.width * data.height)
  for (let i = 0; i < real.length; i++) {
    real[i] = Math.cos(p.data[i])
    imag[i] = Math.sin(p.data[i])
  }
  return ifft({
    ...data,
    real,
    imag
  })
}
