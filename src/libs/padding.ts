import { ComplexMatrix } from "./fft2";

export function doubleSize(mat: ComplexMatrix,
  padding: "zero" | "mirror"): ComplexMatrix {
  const width = mat.width * 2
  const height = mat.height * 2
  const result: ComplexMatrix = {
    imag: new Float32Array(width * height),
    real: new Float32Array(width * height),
    width, height,
    ox: mat.ox,
    oy: mat.oy
  }
  for (let x = 0; x < mat.width; x++) {
    for (let y = 0; y < mat.height; y++) {
      let i = y * mat.width + x
      let j = y * width + x
      result.imag[j] = mat.imag[i]
      result.real[j] = mat.real[i]
    }
  }
  if (padding === 'zero') {
    return result
  }
  for (let x = mat.width; x < width; x++) {
    for (let y = 0; y < mat.height; y++) {
      let j = y * width + x
      let x1 = mat.width - (x - mat.width) - 1
      let i = y * mat.width + x1
      result.imag[j] = mat.imag[i]
      result.real[j] = mat.real[i]
    }
  }
  for (let x = 0; x < mat.width; x++) {
    for (let y = mat.height; y < height; y++) {
      let j = y * width + x
      let y1 = mat.height - (y - mat.height) - 1
      let i = y1 * mat.width + x
      result.imag[j] = mat.imag[i]
      result.real[j] = mat.real[i]
    }
  }
  for (let x = mat.width; x < width; x++) {
    for (let y = mat.height; y < height; y++) {
      let j = y * width + x
      let y1 = mat.height - (y - mat.height) - 1
      let x1 = mat.width - (x - mat.width) - 1
      let i = y1 * mat.width + x1
      result.imag[j] = mat.imag[i]
      result.real[j] = mat.real[i]

    }

  }
  return result
}
export function paddingCentric(mat: ComplexMatrix,
  factor: number
) {
  const halfDx = Math.floor((mat.width * factor - mat.width) / 2)
  const halfDy = Math.floor((factor * mat.height - mat.height) / 2)
  const width = mat.width + halfDx * 2
  const height = mat.width + halfDy * 2
  const result: ComplexMatrix = {
    real: new Float32Array(width * height),
    imag: new Float32Array(width * height),
    width, height,
    ox: mat.ox + halfDx,
    oy: mat.oy + halfDy
  }
  for (let x = 0; x < mat.width; x++) {
    for (let y = 0; y < mat.height; y++) {
      const x1 = x + halfDx
      const y2 = y + halfDy
      const j = x1 + y2 * width
      const i = x + y * mat.width
      result.real[j] = mat.real[i]
      result.imag[j] = mat.imag[i]
    }
  }
  return result
}

export function halfSize(mat: ComplexMatrix): ComplexMatrix {
  const width = Math.floor(mat.width / 2)
  const height = Math.floor(mat.height / 2)
  const result: ComplexMatrix = {
    imag: new Float32Array(width * height),
    real: new Float32Array(width * height),
    width, height,
    ox: 0,
    oy: 0
  }
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let i = y * mat.width + x
      let j = y * width + x
      result.imag[j] = mat.imag[i]
      result.real[j] = mat.real[i]
    }
  }
  return result
}
