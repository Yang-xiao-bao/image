import { Line } from "@antv/g2plot"
import { createEffect, createMemo } from "solid-js"

export type CurveViewerProps = {
  range: [number, number]
  fn: (input: number) => number
  step: number
}
export function CurveViewer(props: CurveViewerProps) {
  const ps = createMemo(() => {
    const [min, max] = props.range
    const step = props.step
    const points: { x: number, y: number }[] = []
    for (let i = min; i < max; i += step) {
      points.push({ x: i, y: props.fn(i) })
    }
    return points
  })
  const container = <div /> as HTMLDivElement
  const chart = new Line(container, {
    xField: "x",
    yField: "y",
    yAxis: {
      type: "linear",
    },
    xAxis: {
      type: "linear",
    },
    smooth: true,
    data: ps()
  })
  chart.render()
  createEffect(() => {
    chart.changeData(ps())
  })
  return container
}
