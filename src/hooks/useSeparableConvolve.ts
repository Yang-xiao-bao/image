import { createSignal } from 'solid-js'
import { FloatImageData } from '../libs/image'
import { run, Runner } from '../libs/runner'
import { convolve } from '../libs/separableKernel'
export function useSeparableConvolve() {
  let runner: Runner<ImageData | FloatImageData | undefined> | null = null
  let [progress, setProgress] = createSignal(0)
  let [img, setImage] = createSignal<FloatImageData | null>(null)
  return [
    img,
    progress,
    (img: ImageData, kernel: number[][],
      padding: 'zero' | 'replicate' = 'replicate'
    ) => {
      if (runner) runner.stop()
      runner = run(convolve, img, kernel, padding)
      runner.start(setProgress)
        .then(setImage)
    }
  ] as const
}
