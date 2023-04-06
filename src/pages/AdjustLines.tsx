import { createMemo, createSignal } from "solid-js";
import { HistBar } from "../components/HistBar";
import { ImagePreview } from "../components/ImagePreview";
import { ImageSelector } from "../components/ImageSelector";
import { LineEditor } from "../components/LineEditor";
import { adjustLines } from "../libs/adjustLines";
import imgUrl from '../assets/hist-match-demo.jpg'
import { Text } from "@hope-ui/solid";
import style from './AdjustLines.module.css'

export function AdjustLines() {
  const [points, setPoints] = createSignal<[number, number][]>([
    [0, 0], [0.16999999999999993, 0.5033333333333332], [0.7133333333333329, 0.6200000000000004], [0.9200000000000004, 0.9966666666666667]
  ]);
  const [image, setImage] = createSignal<ImageData | null>(null)
  const effect = createMemo(() => {
    const img = image()
    const ps = points()
    if (img) {
      console.time('adjustLines')
      const r = adjustLines(img, ps)
      console.timeEnd("adjustLines")
      return <div class={style.images}>
        <div>
          <Text>原图</Text>
          <ImagePreview image={img} />
          <HistBar image={img} />
        </div>
        <div>
          <Text>调整后</Text>
          <ImagePreview image={r} />
          <HistBar image={r} />
        </div>
      </div>
    }
    return null
  })
  return <div>
    <ImageSelector
      onSelect={setImage}
      options={[
        { label: 'Demo', url: imgUrl }
      ]}
    />
    <div>
      <LineEditor points={points()} onChange={setPoints} />
    </div>
    {effect}
  </div>
}
