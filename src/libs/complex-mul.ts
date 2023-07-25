import { ComplexMatrix } from "./fft2"

export function mul(left: ComplexMatrix, right: ComplexMatrix): ComplexMatrix {
  if (left.width !== right.width || left.height !== right.height) {
    throw new Error("Size mismatch")
  }
  if (left.ox !== right.ox || left.oy !== right.oy) {
    console.warn("Original point mismatch")
  }
  const result = {
    real: new Float32Array(left.real.length),
    imag: new Float32Array(right.imag.length),
    width: left.width,
    height: left.height,
    ox: left.ox,
    oy: left.oy
  }
  for (let i = 0; i < left.imag.length; i++) {
    const a = left.real[i]
    const b = left.imag[i]
    const c = right.real[i]
    const d = right.imag[i]
    result.real[i] = a * c - b * d
    result.imag[i] = a * d + b * c
  }
  return result
}
