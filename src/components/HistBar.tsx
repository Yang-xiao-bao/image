import { Channel } from "../types/image"
import { Column } from '@antv/g2plot'
import { hist } from "../libs/hist"
import { createEffect } from "solid-js"
import { Text } from "@hope-ui/solid"
import style from './HistBar.module.css'

export type HistProps = {
  image: ImageData
  channel: Omit<Channel, 'all'>
  normalize?: boolean
  width?: string
  height?: string
  title?: string
}

export function HistBar(props: HistProps) {
  const container = <div
    style={{
      width: props.width ?? "300px",
      height: props.height ?? "300px"
    }}
  /> as HTMLDivElement
  const chart = new Column(container, {
    xField: 'x',
    yField: 'y',
    data: [],
    intervalPadding: 0
  })
  const update = () => {
    const total = props.image.width * props.image.height
    const trans = props.normalize
      ? (val: number, ind: number) => ({ x: ind, y: val / total })
      : (val: number, ind: number) => ({ x: ind, y: val })
    const data = Array.from((hist(props.image)[props.channel as 'r']))
      .map(trans)
    chart.update({ data })
  }
  createEffect(() => {
    update()
  })

  return <div>
    {container}
    <Text class={style.title}>
      {props.title}
    </Text>
  </div>
}
