import { add, ones, mul, scale } from "./complex-ops";
import { complex, fft, ifft, translate } from "./fft2";
import { GrayImageData } from "./image";
import { padRightBottom, takeLeftTop } from "./padding";

export function unsharpMasking(filter: GrayImageData, img: GrayImageData, k1: number, k2: number) {
  // Mask = 原图 - 低通
  // 锐化 = 原图 + k*低通
  const padded = padRightBottom(complex(img), 'mirror')
  const fftData = fft(
    translate(padded.width / 2 | 0, padded.height / 2 | 0, padded)
  )
  const K1 = ones(padded.width, padded.height)
  K1.real.fill(k1)

  // ifft((K1 + K2*filter)*fftData)
  const enhanded = takeLeftTop(ifft(
    mul(
      fftData,
      add(K1,
        scale(k2, complex(filter)))
    )))
  return { enhanded, fftData }
}
