import ndarray from "ndarray";
import { GrayImageData } from "./image";
import ndfft from 'ndarray-fft';

export type ComplexMatrix = {
  real: Float32Array,
  imag: Float32Array,
  width: number,
  height: number,
  ox: number,
  oy: number
}
export function isComplexMatrix(data: any): data is ComplexMatrix {
  return data.real != null &&
    data.imag != null &&
    data.width != null &&
    data.height != null &&
    data.ox != null &&
    data.oy != null
}
/**
* 将图像的原点定义为左上角，f(x,y) 表示图像
* F(u,v) 表示其傅里叶变换，则 f(x,y)乘以下列
* 项，可以将傅里叶变换的原点（低频）移动到u_0,v_0 处
           ⎛          ⎛u    v ⎞⎞
           ⎜          ⎜ 0    0⎟⎟
           ⎜-j2 ⋅ π ⋅ ⎜── + ──⎟⎟
           ⎝          ⎝ M    N⎠⎠
          e
* */
export function translate(
  u: number, v: number, img: GrayImageData | ComplexMatrix
) {
  const M = img.width
  const N = img.height
  const real = new Float32Array(M * N)
  const imag = new Float32Array(M * N)
  if (isComplexMatrix(img)) {
    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        const theta = 2 * Math.PI * (u * x / M + v * y / N)
        const index = y * M + x
        const exp = [Math.cos(theta), Math.sin(theta)]
        const item = [img.real[index], img.imag[index]]
        // 复数乘
        // (a + bj) ⋅ (c + dj) = (ac - bd) + (ad + bc) ⋅ j
        const [a, b] = exp
        const [c, d] = item
        real[index] = a * c - b * d
        imag[index] = a * d + b * c
      }
    }
  }
  else {
    for (let x = 0; x < img.width; x++) {
      for (let y = 0; y < img.height; y++) {
        const theta = -2 * Math.PI * (u * x / M + v * y / N)
        const index = y * M + x
        real[index] = img.data[index] * Math.cos(theta)
        imag[index] = img.data[index] * Math.sin(theta)
      }
    }
  }
  return {
    real,
    imag,
    width: M,
    height: N,
    ox: u,
    oy: v
  }
}


export function fft(img: GrayImageData | ComplexMatrix, ifft = false) {
  const [real, imag]
    = isComplexMatrix(img)
      ? [

        ndarray(
          new Float32Array(img.real),
          [img.height, img.width]
        ),
        ndarray(
          new Float32Array(img.imag),
          [img.height, img.width]
        )

      ]
      : [
        ndarray(
          new Float32Array(img.data),
          [img.height, img.width]
        ),
        ndarray(
          new Float32Array(img.width * img.height),
          [img.height, img.width]
        )
      ]

  ndfft(ifft ? -1 : 1, real, imag)
  return {
    width: img.width,
    height: img.height,
    real: real.data,
    imag: imag.data,
    ox: isComplexMatrix(img) ? img.ox : 0,
    oy: isComplexMatrix(img) ? img.oy : 0
  }
}
export function ifft(img: ComplexMatrix) {
  if (img.ox !== 0 || img.oy !== 0) {
    // 从原点移动过的FFT数据复原图像
    const ifftImg = fft(img, true)
    return getImage(
      translate(img.ox, img.oy, ifftImg)
    )
  }
  return getImage(
    fft(img, true)
  )
}
export function complex(img: GrayImageData, ox = 0, oy = 0): ComplexMatrix {
  return {
    real: new Float32Array(img.data),
    imag: new Float32Array(img.width * img.height),
    width: img.width,
    height: img.height,
    ox,
    oy,
  }
}
export function getImage(data: ComplexMatrix) {
  return {
    width: data.width,
    height: data.height,
    data: data.real,
    hit: 'clamp'
  } as GrayImageData
}
