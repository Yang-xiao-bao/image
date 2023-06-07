import Plotly from 'plotly.js'
import { createEffect, createMemo, onMount } from 'solid-js'

export type SurfaceViewerProps = {
  x: [number, number],
  y: [number, number],
  z: (x: number, y: number) => number
  steps: [number, number]
}
export function SurfaceViewer(props: SurfaceViewerProps) {
  const surface = createMemo(() => {
    const zs: number[][] = []
    for (let x = props.x[0]; x < props.x[1]; x += props.steps[0]) {
      const z: number[] = []
      for (let y = props.y[0]; y < props.y[1]; y += props.steps[1]) {
        z.push(props.z(x, y))
      }
      zs.push(z)
    }
    return {
      z: zs,
      type: 'surface' as const
    }
  })
  const div = <div /> as HTMLDivElement
  let p: Plotly.Root
  const data = [surface()]
  onMount(() => {
    Plotly.newPlot(div,
      data,
      {
        width: 300,
        height: 300,
        autosize: true,
      })
      .then((root) => {
        p = root
      })
  })
  createEffect(() => {
    data[0] = surface()
    if (p) {
      Plotly.redraw(p)
    }
  })
  return div
}
