import { ComplexMatrix } from "./fft2";

export function padRightBottom(mat: ComplexMatrix,
  padding: "zero" | "mirror",
  width: number = 2*mat.width,
  height: number = 2*mat.height
): ComplexMatrix {
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
export function padAround(
  mat: ComplexMatrix,
  left: number,
  top: number,
  right: number,
  bottom: number
) {
  const width = mat.width + left + right
  const height = mat.height + top + bottom
  const result: ComplexMatrix = {
    real: new Float32Array(width * height),
    imag: new Float32Array(width * height),
    width, height,
    ox: mat.ox + left,
    oy: mat.oy + top
  }
  for (let x = 0; x < mat.width; x++) {
    for (let y = 0; y < mat.height; y++) {
      const x1 = x + left - 1
      const y2 = y + top - 1
      const j = x1 + y2 * width
      const i = x + y * mat.width
      result.real[j] = mat.real[i]
      result.imag[j] = mat.imag[i]
    }
  }
  return result
}

export function takeLeftTop(
  mat: ComplexMatrix,
  width: number = mat.width / 2,
  height: number = mat.height / 2
): ComplexMatrix {
  if (width > mat.width || height > mat.height) {
    throw new Error("width and height must be smaller than mat.width and mat.height")
  }
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
