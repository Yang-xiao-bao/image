import { createEffect } from "solid-js"
import { show } from "../libs/show"
import { Channel } from "../types/image"


export type ImagePreviewProps = {
  image: ImageData
  channel?: Channel
}
export function ImagePreview(props: ImagePreviewProps) {
  const canvas = <canvas
    width={props.image.width}
    height={props.image.height}
  /> as HTMLCanvasElement
  createEffect(() => {
    const ctx = canvas.getContext('2d')
    show(props.image,ctx!,props.channel ?? 'all')
  })

  return canvas
}
