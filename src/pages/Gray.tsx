import { Text } from '@hope-ui/solid'
import { createMemo, createSignal } from 'solid-js'
import { match, P } from 'ts-pattern'
import { Highlight } from '../components/CodeBlock'
import { HistBar } from '../components/HistBar'
import { ImagePreview } from '../components/ImagePreview'
import { ImageSelector } from '../components/ImageSelector'
import { Slider } from '../components/Slider'
import { gray } from '../libs/gray'
import style from './Gray.module.css'

export function Gray() {
  const [image, setImage] = createSignal<ImageData | null>(null)
  const [points, setPoints] = createSignal([1 / 3, 2 / 3])
  const final = createMemo(() => {
    const img = image()
    if (img) {
      const [a, b] = points()
      return gray(img, [a, b - a, 1 - b])
    }
  })
  const r = createMemo(() => {
    const img = image()
    if (img) {
      return gray(img, [1, 0, 0])
    }
  })
  const g = createMemo(() => {
    const img = image()
    if (img) {
      return gray(img, [0, 1, 0])
    }
  })

  const b = createMemo(() => {
    const img = image()
    if (img) {
      return gray(img, [0, 0, 1])
    }
  })
  const weights = () => {
    const [a, b] = points();
    return `${a.toFixed(2)},${(b - a).toFixed(2)},${(1 - b).toFixed(2)}`
  }
  return <div class={style.container}>
    <ImageSelector onSelect={setImage} />
    <Slider points={points()}
      max={1}
      min={0}
      onChange={setPoints}
    />
    <Highlight
      code={`gray(img,[${weights()}])`}
    />
    {match(final())
      .with(P.not(P.nullish), (img) => <div class={style.previewContainer}>
        <div class={style.origin}>
          <ImagePreview image={image()!} />
        </div>
        <div class={style.hist}>
          <Text>结果</Text>
          <div class={style.monoChannelPreviewContainer}>
            <ImagePreview class={style.monoChannelPreview} image={img} />
            <HistBar image={img} channel="r" height="100px" width="200px" />
          </div>
        </div>
        <div class={style.redChannel}>
          <Text>仅红通道</Text>
          <div class={style.monoChannelPreviewContainer}>
            <ImagePreview class={style.monoChannelPreview} image={r()!} />
            <HistBar image={r()!} channel="r" width="200px" height="100px" />
          </div>
        </div>
        <div class={style.greenChannel}>
          <Text>仅绿通道</Text>
          <div class={style.monoChannelPreviewContainer}>
            <ImagePreview class={style.monoChannelPreview} image={g()!} />
            <HistBar image={g()!} channel="r" width="200px" height="100px" />
          </div>
        </div>
        <div class={style.blueChannel}>
          <Text>仅蓝通道</Text>
          <div class={style.monoChannelPreviewContainer}>
            <ImagePreview class={style.monoChannelPreview} image={b()!} />
            <HistBar image={b()!} channel="r" width="200px" height="100px" />
          </div>
        </div>
      </div>)
      .otherwise(() => null)
    }
  </div>
}
