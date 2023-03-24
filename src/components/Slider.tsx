import { Accessor, For, onCleanup } from "solid-js"
import { Tooltip } from '@hope-ui/solid'
import style from './Slider.module.css'

export type SliderProps = {
  class?: string
  points: number[]
  max: number
  min: number
  onChange: (points: number[]) => void
}
export function Slider(props: SliderProps) {
  return <div class={`${style.track} ${props.class}`}>
    <For each={props.points} >
      {(i, ind) =>
        <button
          class={style.thumb}
          use:drag={(p: number) => {
            const val = props.min + p * (props.max - props.min)
            const ps = () => props.points
            const n = [...ps()]
            n[ind()] = val
            props.onChange(n)
          }}
          style={{
            left: `${(i - props.min) / (props.max - props.min) * 100}%`
          }}
        />
      }
    </For>
  </div>
}

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      drag: (p: number) => void;
    }
  }
}
function drag(el: HTMLButtonElement, onDone: Accessor<(p: number) => void>) {
  let movementX = 0
  let offsetLeft = el.offsetLeft
  const halfSize = el.clientWidth / 2
  const move = (e: MouseEvent) => {
    movementX += e.movementX
    const x = offsetLeft + movementX
    if (x >= halfSize && x <= el.offsetParent!.clientWidth) {
      el.style.translate = `${movementX}px`
    } else {
      movementX -= e.movementX
    }
  }
  const mouseUp = () => {
    const x = offsetLeft + movementX
    onDone()?.(x / el.offsetParent!.clientWidth)
    document.body.removeEventListener('mouseup', mouseUp)
    document.body.removeEventListener('mousemove', move)
  }
  const mouseDown = () => {
    offsetLeft = el.offsetLeft
    document.body.addEventListener('mouseup', mouseUp)
    document.body.addEventListener('mousemove', move)
  }
  el.addEventListener('mousedown', mouseDown)
  onCleanup(() => {
    el.removeEventListener('mousedown', mouseDown)
  })
}
