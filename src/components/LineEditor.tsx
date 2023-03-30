import style from './LineEditor.module.css'
import { createEffect, createMemo, For, onCleanup } from 'solid-js'
import { clamp } from '../utils/clamp'
import { Lines, Canvas, useRenderingContext } from './canvas'

export type LineEditorProps = {
  /**
   * 每个点的坐标范围为[0,1]
   * */
  points: [x: number, y: number][]
  onChange: (points: [x: number, y: number][]) => void
}
export function LineEditor(props: LineEditorProps) {
  let container: HTMLDivElement | undefined
  return <div class={style.container} ref={container} onClick={e => {
    if (e.target === container) {
      const x = e.offsetX / container.clientWidth
      const y = 1 - e.offsetY / container.clientHeight
      const ps = [...props.points]
      const newPoint = [x, y] as [number, number]
      ps.push(newPoint)
      ps.sort((a, b) => a[0] - b[0])
      const index = ps.indexOf(newPoint)
      if (index > -1) {
        const prev = ps[index - 1][1] ?? ps[index + 1][1]
        const next = ps[index + 1][1] ?? ps[index - 1][1]
        const [min, max] = prev < next ? [prev, next] : [next, prev]
        if (y < min || y > max) {
          ps[index][1] = (min + max) / 2
        }
      }

      props.onChange(ps)

    }
  }}>
    <Canvas width={300} height={300} >
      <Lines width={300} height={300} points={props.points} />
    </Canvas>
    <For each={props.points}>{([x, y], index) => <button
      class={style.point}
      data-index={index()}
      ref={drag({
        getPos() {
          return props.points[index()]
        },
        getClampRange() {
          const ind = index()
          if (ind == 0) {
            return {
              x: [0, props.points[1][0] ?? 1],
              y: [0, props.points[1][1] ?? 1],
            }
          } else if (ind == props.points.length - 1) {
            return {
              x: [props.points[ind - 1][0], 1],
              y: [props.points[ind - 1][1], 1],
            }
          } else {
            return {
              x: [props.points[ind - 1][0], props.points[ind + 1][0]],
              y: [props.points[ind - 1][1], props.points[ind + 1][1]]
            }
          }
        },
        onUpdate: (x, y) => {
          const ps = () => props.points
          const n = [...ps()]
          n[index()] = [x, y]
          props.onChange(n)
        },
        onDone: (e) => {
          if (props.points.length === 2 || !container) {
            return
          }
          const rect = container.getBoundingClientRect()
          const padding = 50
          if (e.clientX + padding < rect.left || e.clientX - padding > rect.right || e.clientY + padding < rect.top || e.clientY - padding > rect.bottom) {
            console.log("Delete")
            const ps = () => props.points
            const n = [...ps()]
            n.splice(index(), 1)
            props.onChange(n)
          }
        }
      })}
      style={{
        left: `calc(${x * 100}% - var(--point-size) / 2)`,
        bottom: `calc(${y * 100}% - var(--point-size) / 2)`,
      }}
    />}</For>
  </div>
}
function drag(params: {
  getPos: () => [number, number]
  getClampRange: () => { x: [number, number], y: [number, number] }
  onUpdate: (x: number, y: number) => void
  onDone: (e: MouseEvent) => void
}) {
  return function drag(el: HTMLButtonElement) {
    const handleMouseDown = () => {
      document.body.addEventListener('mousemove', handleMouseMove)
      document.body.addEventListener('mouseup', handleMouseUp)
    }
    const handleMouseUp = (e: MouseEvent) => {
      document.body.removeEventListener('mousemove', handleMouseMove)
      document.body.removeEventListener('mouseup', handleMouseUp)
      params.onDone(e)
    }
    const w = 300
    const h = 300
    const handleMouseMove = (e: MouseEvent) => {
      let [x, y] = params.getPos()
      const range = params.getClampRange()
      x = x + e.movementX / w
      y = y - e.movementY / h
      x = clamp(x, range.x[0], range.x[1])
      y = clamp(y, range.y[0], range.y[1])
      params.onUpdate(x, y)
    }
    el.addEventListener('mousedown', handleMouseDown)
    onCleanup(() => {
      el.removeEventListener('mousedown', handleMouseDown)
    })
  }
}
