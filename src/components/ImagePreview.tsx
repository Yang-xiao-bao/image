import { Text } from "@hope-ui/solid"
import { createEffect } from "solid-js"
import { show } from "../libs/show"
import { Channel } from "../types/image"


export type ImagePreviewProps = {
  class?: string
  image: ImageData
  channel?: Channel
  title?: string
}
export function ImagePreview(props: ImagePreviewProps) {
  const canvas = <canvas
    class={props.class}
    width={props.image.width}
    height={props.image.height}
  /> as HTMLCanvasElement
  createEffect(() => {
    const ctx = canvas.getContext('2d')
    show(props.image, ctx!, props.channel ?? 'all')
  })

  return <div>
    <Text>{props.title}</Text>
    {canvas}
  </div>
}
