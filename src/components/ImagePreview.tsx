import { Text } from "@hope-ui/solid"
import { createEffect, createMemo, createSignal, JSX } from "solid-js"
import { FloatImageData, GrayImageData, toImageData } from "../libs/image"
import { show } from "../libs/show"
import { Channel } from "../types/image"
import style from './ImagePreview.module.css'


export type ImagePreviewProps = {
  class?: string
  image: ImageData | FloatImageData | GrayImageData
  channel?: Channel
  title?: JSX.Element
}
export function ImagePreview(props: ImagePreviewProps) {
  const [pos, setPos] = createSignal<[number, number] | null>()
  const canvas = <canvas
    class={props.class + ' ' + style.canvas}
    style={{
      display: 'inline'
    }}
    onMouseMove={e => {
      const x = e.offsetX / e.currentTarget.clientWidth
      const y = e.offsetY / e.currentTarget.clientHeight
      setPos([x, y])
    }}
    onMouseOut={e => setPos(null)}
    width={props.image.width}
    height={props.image.height}
  /> as HTMLCanvasElement
  createEffect(() => {
    const ctx = canvas.getContext('2d')
    const imageData = props.image instanceof ImageData
      ? props.image
      : toImageData(props.image)
    show(imageData, ctx!, props.channel ?? 'all')
  })
  const rgb = createMemo(() => {
    const p = pos()
    if (p) {
      const x = ~~(p[0] * (props.image.width - 1))
      const y = ~~(p[1] * (props.image.height - 1))
      const r = props.image.data[4 * (x + y * props.image.width)]
      const g = props.image.data[4 * (x + y * props.image.width) + 1]
      const b = props.image.data[4 * (x + y * props.image.width) + 2]
      return `rgb(${r},${g},${b})`
    }
    return null
  })
  const rgbStyle = createMemo(() => {
    const p = pos()
    if (p) {
      if (p[0] > 0.5 && p[1] > 0.5) {
        return {
          left: "0"
        }
      }
    }
    return { right: "0" }
  })

  return <div class={style.container+' '+props.class}>
    <Text>{props.title}</Text>
    <span style={{position:'relative'}}>
      {canvas}
      <div class={style.rgb} style={rgbStyle()}>
        {rgb()}
      </div>
    </span>
  </div>
}
