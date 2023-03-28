import { createMemo, createSignal } from "solid-js";
import { ImageSelector } from "../components/ImageSelector";
import pollen from '../assets/pollen.png'
import { match, P } from "ts-pattern";
import { ImagePreview } from "../components/ImagePreview";
import { HistBar } from "../components/HistBar";
import { Slider } from "../components/Slider";
import { adjust } from "../libs/adjust";
import { stretchlim } from "../libs/stretchlim";
import { Flex } from "@hope-ui/solid";
import { Highlight } from "../components/CodeBlock";

export function StretchLim() {
  const [image, setImage] = createSignal<ImageData>()
  const [points, setPoints] = createSignal([0.01, 0.99])
  const input = createMemo(() => {
    const img = image()
    if (img) {
      return stretchlim(img, points()).r.map(i => i / 255)
    }
    return []
  })
  const result = createMemo(() => {
    const img = image()
    const i = input()
    if (img && i.length === 2) {
      return adjust(img, i as [number, number], [0, 1], 1)
    }
    return null
  })
  const code = createMemo(() => {
    const i = input()
    if (i.length > 0) {
      return `
      const i = stretchlim(img,[${points()}])
      // i = [${i}]
      adjust(img,i,[0,1],1)})`
    }
    return ""
  })
  return <div>
    <b>仅灰度图</b>
    <ImageSelector onSelect={setImage}
      options={[{ label: '花粉', url: pollen }]}
    />
    <Slider
      min={0}
      max={1}
      points={points()}
      onChange={setPoints}
    />
    <Highlight code={code()} />
    {match(image())
      .with(P.not(P.nullish), (img) => <Flex>
        <div>
          <ImagePreview image={img} title="原图" />
          <HistBar image={img} channel="r" />
        </div>
        <div>
          <ImagePreview image={result()!} title="拉伸后" />
          <HistBar image={result()!} channel="r" />
        </div>
      </Flex>)
      .otherwise(() => <div>请选择图片</div>)
    }
  </div>
}
