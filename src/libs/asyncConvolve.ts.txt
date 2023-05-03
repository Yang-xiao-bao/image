import { FloatImageData } from "./image";
import { padImage } from "./padImage";

export type Control = 'continue' | 'halt'
export function* asyncConvolve(
  img: ImageData | FloatImageData,
  kernel: number[][],
  padding: 'zero' | 'replicate' = 'replicate'
) {

  let counter = 0
  const result: FloatImageData = {
    width: img.width,
    height: img.height,
    data: new Float32Array(img.width * img.height * 4),
    hit:'remap'
  }
  const kernelWidth = kernel[0].length;
  const kernelHeight = kernel.length;
  const size = img.width * img.height //(img.width + (kernelWidth-1)) * (img.height + (kernelHeight-1))
  const STEP = ~~(size * 0.01)
  const padded: ImageData | FloatImageData = padImage(
    img,
    kernelWidth,
    kernelHeight,
    padding
  )
  for (let row = 0; row < result.height; row++) {
    for (let col = 0; col < result.width; col++) {
      let r = 0;
      let g = 0;
      let b = 0;
      for (let kx = 0; kx < kernelWidth; kx++) {
        for (let ky = 0; ky < kernelHeight; ky++) {
          const px = col + kx
          const py = row + ky
          const ind = (py * padded.width + px) * 4
          //const k = kernel[kernelHeight - ky - 1][kernelWidth - kx - 1]
          const k = kernel[ky][kx]
          r += padded.data[ind + 0] * k
          g += padded.data[ind + 1] * k
          b += padded.data[ind + 2] * k
        }
      }

      const ind = (row * result.width + col) * 4
      result.data[ind + 0] = r;
      result.data[ind + 1] = g;
      result.data[ind + 2] = b;
      result.data[ind + 3] = 255;
      if (++counter % STEP === 0) {
        const control: Control = yield (counter / size)
        if (control === 'halt') return
      }
    }
  }

  yield 1
  return result
}

export type AsyncConvolveRunner = {
  start(onProgress?: (progress: number) => void): Promise<FloatImageData | null>
  stop(): void
}
export function run(img: ImageData, kernel: number[][]): AsyncConvolveRunner {
  let stopSignal = false
  let timer = -1
  return {
    start(onProgress?: (progress: number) => void) {
      stopSignal = false
      const generator = asyncConvolve(img, kernel)
      return new Promise<FloatImageData | null>((resolve, reject) => {
        const schedule = () => {
          timer = setTimeout(() => {
            const { value, done } = generator.next(stopSignal ? 'halt' : 'continue')
            if (!done) {
              onProgress?.(value)
              schedule()
            } else {
              if (value) {
                resolve(value)
              } else {
                resolve(null)
              }
            }
          })
        }
        schedule()
      })
    },
    stop() {
      stopSignal = true
      clearTimeout(timer)
    }
  }
}
