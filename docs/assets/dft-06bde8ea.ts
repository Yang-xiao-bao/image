import * as math from 'mathjs'
import { GrayImageData } from './image'

export type DFTData = {
  width: number
  height: number
  real: Float32Array
  imag: Float32Array
  shifted: boolean
}
export function DFT(image: GrayImageData, shift = false) {
  if (shift) {
    image = shiftPreprocess(image)
  }

  const { width, height } = image
  const real = new Float32Array(width * height)
  const imag = new Float32Array(width * height)
  /*
   * M - 1
   * ______
   * ╲      N - 1
   *  ╲     ____
   *   ╲    ╲                ⎛         ⎛ux   vy⎞    ⎞
   *    ╲    ╲               ⎜-2 ⋅ π ⋅ ⎜── + ──⎟ ⋅ i⎟
   *    ╱    ╱               ⎝         ⎝ M    N⎠    ⎠
   *   ╱    ╱     f(x, y) ⋅ e
   *  ╱     ‾‾‾‾
   * ╱      y = 0
   * ‾‾‾‾‾‾
   *  x = 0
   * **/
  for (let u = 0; u < width; u++) {
    for (let v = 0; v < height; v++) {
      let sum = [0, 0]
      let uOverWidth = u / width
      let vOverHeight = v / height
      let twoPi = -2 * Math.PI
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const f = image.data[y * width + x]
          const theta = twoPi * (x * uOverWidth + y * vOverHeight)
          // e^ix = cos(x) + i * sin(x)
          sum[0] += f * Math.cos(theta)
          sum[1] += f * Math.sin(theta)
        }
      }
      const index = v * width + u
      real[index] = sum[0]
      imag[index] = sum[1]
    }
  }
  const result: DFTData = {
    width,
    height,
    real,
    imag,
    shifted:shift
  }
  return result
}

export function DFT_(image: GrayImageData, shift = false): DFTData {
  if (shift) {
    image = shiftPreprocess(image)
  }

  const { width, height } = image
  const real = new Float32Array(width * height)
  const imag = new Float32Array(width * height)
  const complex: math.Complex[] = []
  for (let u = 0; u < width; u++) {
    for (let v = 0; v < height; v++) {
      let sum = math.complex(0, 0)
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const f = image.data[y * width + x]
          sum =
            math.add(
              sum,
              math.multiply(
                f,
                math.exp(
                  math.complex(0, -2 * Math.PI * (u * x / width + v * y / height))
                )
              )
            ) as math.Complex
        }
      }
      const index = v * width + u
      real[index] = sum.re
      imag[index] = sum.im
      complex[index] = sum
    }
  }
  return {
    width,
    height,
    real,
    imag,
    shifted:shift
  }
}
function shiftPreprocess(image: GrayImageData) {
  const data = new Float32Array(image.width * image.height)
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const index = y * image.width + x
      data[index] = image.data[index] * Math.pow(-1, x + y)
    }
  }
  return {
    ...image,
    data
  }
}
export function IDFT(dft: DFTData) {
  const { width, height } = dft
  const data = new Float32Array(width * height)
  /*
   *        M - 1
   *       ______
   *       ╲      N - 1
   *        ╲     ____
   *         ╲    ╲                ⎛        ⎛ux   vy⎞    ⎞
   *          ╲    ╲               ⎜2 ⋅ π ⋅ ⎜── + ──⎟ ⋅ i⎟
   *   1      ╱    ╱               ⎝        ⎝ M    N⎠    ⎠
   *  ── ⋅   ╱    ╱     F(x, y) ⋅ e
   *  MN    ╱     ‾‾‾‾
   *       ╱      y = 0
   *       ‾‾‾‾‾‾
   *        x = 0
   * **/
  for (let u = 0; u < width; u++) {
    for (let v = 0; v < height; v++) {
      let sum = math.complex(0, 0)
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          //const f = complex[y * width + x]
          const f = math.complex(
            dft.real[y * width + x],
            dft.imag[y * width + x]
          )
          sum =
            math.add(
              sum,
              math.multiply(
                f,
                math.exp(
                  math.complex(0, 2 * Math.PI * (u * x / width + v * y / height))
                )
              )
            ) as math.Complex
        }
      }
      const index = v * width + u
      data[index] = sum.re / (width * height)
    }
  }
  return {
    width,
    height,
    data,
    hit: 'remap'
  }
}
