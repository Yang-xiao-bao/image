import { createEffect } from "solid-js"
import { useRenderingContext } from "./Canvas"

export function Lines(props: { points: [number, number][], width: number, height: number }) {
  const draw = () => {
    const ctx = useRenderingContext()
    ctx.save()
    //TODO: 不在这里清空画布
    ctx.clearRect(0,0,props.width,props.height)
    ctx.beginPath()
    const points = props.points.map(([x, y]) => [x, 1 - y])
    const [first, ...ps] = points
    ctx.strokeStyle = 'red'
    ctx.moveTo(first[0] * props.width, first[1] * props.height)
    for (let p of ps) {
      ctx.lineTo(p[0] * props.width, p[1] * props.height)
    }
    ctx.stroke()
    ctx.restore()
  }
  createEffect(() => {
    draw()
  })
  draw()
  return null
}
