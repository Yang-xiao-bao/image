import { createEffect, createMemo, createSignal } from "solid-js"
import { HistBar } from "../components/HistBar"
import { ImagePreview } from "../components/ImagePreview"
import { ImageSelector } from "../components/ImageSelector"
import { exactHistMatch } from "../libs/exactHistMatch"
import { HistType } from "../libs/hist"

export function ExcatHistMatch() {
  const [image, setImage] = createSignal<ImageData | null>()

  const r = createMemo(() => {
    const img = image()
    if (img) {
      const h = randomHist(img.width * img.height)
      console.time("exactHistMatch")
      const r = exactHistMatch(img!, h, 1)
      console.timeEnd("exactHistMatch")
      return <div>
        <HistBar hist={h.r} />
        <ImagePreview image={r} />
        <HistBar image={r} />
      </div>
    }
  })

  return <div>
    <ImageSelector onSelect={(i) => {
      setImage(c => {
        console.log(c === i)
        return i
      })

    }} />
    {r}
  </div>
}

function randomHist(total: number) {
  const hist = new Uint32Array(256)
  while (total > 0) {
    const i = Math.floor(Math.random() * 256)
    hist[i]++
    total--
  }
  return { r: hist, g: hist, b: hist, all: hist }
}