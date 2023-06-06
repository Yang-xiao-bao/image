import { DFTData } from "./dft";
import { ifft } from "./fft";
import { GrayImageData } from "./image";

export function phaseAngle(data: DFTData): GrayImageData {
  const result = new Float32Array(data.width * data.height)
  for (let x = 0; x < data.width; x++) {
    for (let y = 0; y < data.height; y++) {
      const index = y * data.width + x
      result[index] = Math.atan2(
        data.imag[index],
        data.real[index]
      )
    }
  }
  return {
    width: data.width,
    height: data.height,
    data: result,
    hit: 'remap'
  }
}

export function recontructFromPhaseAngle(data: DFTData) {
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
