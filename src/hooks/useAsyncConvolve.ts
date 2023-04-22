import { createSignal } from "solid-js";
import { AsyncConvolveRunner, run } from "../libs/asyncConvolve";

export function useAsyncConvolve() {
  let runner: AsyncConvolveRunner | null = null
  const [img, setImage] = createSignal<ImageData | null>(null)
  const [progress, setProgress] = createSignal(0)
  return [
    img,
    progress,
    (img: ImageData, kernel: number[][]) => {
      if (runner) {
        runner.stop()
      }
      runner = run(img, kernel)
      runner.start(setProgress).then(setImage)
    }
  ] as const
}
