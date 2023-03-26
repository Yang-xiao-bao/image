import { Channel } from "../types/image"
import { Column } from '@antv/g2plot'
import { cumulativeHist, hist } from "../libs/hist"
import { createEffect, createMemo, createSignal, For } from "solid-js"
import { ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Modal, ModalContent, ModalOverlay, Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Radio, RadioGroup, Switch, Text, VStack } from "@hope-ui/solid"
import { AiOutlineMore } from 'solid-icons/ai'
import style from './HistBar.module.css'

export type HistProps = {
  image: ImageData
  channel: Omit<Channel, 'all'>
  width?: string
  height?: string
  title?: string
}

type HistOptions = {
  normalized?: boolean
  cumulative?: boolean
  type: 'linear' | 'log'
}
const [histOption, setHistOption] = createSignal<HistOptions>({ type: 'linear', normalized: false })


export function HistBar(props: HistProps) {
  const container = <div
    style={{
      width: props.width ?? "300px",
      height: props.height ?? "200px"
    }}
  /> as HTMLDivElement
  const chart = new Column(container, {
    xField: 'x',
    yField: 'y',
    data: [],
    intervalPadding: 0,
    animation: false
  })
  const data = createMemo(() => {
    const total = props.image.width * props.image.height
    const trans = histOption().normalized
      ? (val: number, ind: number) => ({ x: ind, y: val / total })
      : (val: number, ind: number) => ({ x: ind, y: val })
    const histFn = histOption().cumulative
      ? cumulativeHist
      : hist
    const data = Array.from((histFn(props.image)[props.channel as 'r']))
      .map(trans)
    return data
  })
  const update = () => {
    chart.update({ data: data(), animation: false })
  }
  createEffect(() => {
    update()
  })
  createEffect(() => {
    const opts = histOption()
    chart.update({
      yAxis: {
        type: opts.type
      }
    })
  })
  const [modalVisible, setModalVisible] = createSignal(false)

  return <div class={style.container}>
    <HistDialog
      visible={modalVisible()}
      onClose={() => setModalVisible(false)}
      data={data().map(d => d.y)}
    />
    <HistOption onShowData={() => { setModalVisible(true) }} />
    {container}
    <Text class={style.title}>
      {props.title}
    </Text>
  </div>
}


function HistDialog(props: { visible: boolean, onClose: () => void, data: number[] }) {
  return <Modal opened={props.visible} onClose={props.onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalCloseButton />
      <ModalHeader>
        直方图数据
      </ModalHeader>
      <ModalBody>
        <table>
          <thead>
            <tr>
              <td>像素值</td>
              <td>出现次数</td>
            </tr>
          </thead>
          <tbody>
            <For each={props.data}>
              {(val, ind) => <tr><td>{ind()}</td><td>{val}</td></tr>}
            </For>
          </tbody>
        </table>
      </ModalBody>
      <ModalFooter>
        <Button onClick={props.onClose}>关闭</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
}

function HistOption(props: {
  onShowData?: () => void
}) {
  return <Popover>
    <PopoverTrigger class={style.optionTrigger}>
      <AiOutlineMore />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverArrow />
      <PopoverCloseButton />
      <PopoverHeader>
        直方图选项
      </PopoverHeader>
      <PopoverBody>
        <VStack spacing={10} justifyItems="start">
          <Switch checked={histOption().normalized} onChange={() => setHistOption(
            cur => ({ ...cur, normalized: !cur.normalized })
          )} >
            归一化
          </Switch>
          <Switch checked={histOption().cumulative} onChange={() => setHistOption(
            cur => ({ ...cur, cumulative: !cur.cumulative })
          )} >
            累积
          </Switch>
          <RadioGroup value={histOption().type}
            onChange={
              (val) => setHistOption(cur => ({ ...cur, type: val as 'linear' | 'log' }))
            }>
            <Radio value={"linear"} >
              线性
            </Radio>
            <Radio value={"log"} >
              对数
            </Radio>
          </RadioGroup>
          <Button onClick={props.onShowData}>显示数据</Button>
        </VStack>
      </PopoverBody>
    </PopoverContent>
  </Popover>
}
