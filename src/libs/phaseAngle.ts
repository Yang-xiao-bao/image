import { DFTData } from "./dft";
import { ifft } from "./fft";
import { GrayImageData } from "./image";

export function phaseAngle(data: { width: number, height: number, real: Float32Array, imag: Float32Array }): GrayImageData {
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

