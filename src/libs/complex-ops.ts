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

export function add(left: ComplexMatrix, right: ComplexMatrix): ComplexMatrix {
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
    result.real[i] = a + c
    result.imag[i] = b + d
  }
  return result
}

export function scale(s: number, m: ComplexMatrix): ComplexMatrix {
  const result = {
    real: new Float32Array(m.real.length),
    imag: new Float32Array(m.imag.length),
    width: m.width,
    height: m.height,
    ox: m.ox,
    oy: m.oy
  }
  for (let i = 0; i < m.imag.length; i++) {
    const a = m.real[i]
    const b = m.imag[i]
    result.real[i] = a * s
    result.imag[i] = b * s
  }
  return result
}

export function ones(width: number, height: number): ComplexMatrix {
  const result = {
    real: new Float32Array(width * height),
    imag: new Float32Array(width * height),
    width,
    height,
    ox: 0,
    oy: 0
  }
  result.real.fill(1)
  return result

}
