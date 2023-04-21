import { createSignal } from "solid-js";
import { AsyncConvolveRunner, run } from "../libs/asyncConvolve";

export function useAsyncConvolve() {
  let runner: AsyncConvolveRunner | null = null
  const [progress, setProgress] = createSignal(0)
  return [
    progress,
    (img: ImageData, kernel: number[][]) => {
      if (runner) {
        runner.stop()
      }
      runner = run(img, kernel)
      runner.start(setProgress)
    }
  ]
}
