import { Channel } from "../types/image"
import { Column } from '@antv/g2plot'
import { hist } from "../libs/hist"
import { createEffect, createMemo, createSignal, For } from "solid-js"
import { ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Modal, ModalContent, ModalOverlay, Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, Radio, RadioGroup, Switch, Text, VStack } from "@hope-ui/solid"
import { AiOutlineMore } from 'solid-icons/ai'
import style from './HistBar.module.css'

export type HistProps = {
  /**
   * image 和 hist 二选一
   * */
  image?: ImageData
  /**
   * 如果image 为undefined，channel 无效
   * */
  channel?: Omit<Channel, 'all'>
  hist?: Uint32Array
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
  return <>
    {
      props.image ?
        <HistBarChart
          width={props.width}
          height={props.height}
          title={props.title}
          hist={hist(props.image)[(props.channel ?? 'r') as 'r']}
        />
        :
        <HistBarChart
          width={props.width}
          height={props.height}
          title={props.title}
          hist={props.hist ?? new Uint32Array}
        />
    }
  </>
}

function HistBarChart(props: {
  hist: Uint32Array,
  width?: string,
  height?: string,
  title?: string
}) {
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
    const opt = histOption()
    const total = props.hist.reduce((a, b) => a + b)
    const trans = opt.normalized
      ? (val: number, ind: number) => ({ x: ind, y: val / total })
      : (val: number, ind: number) => ({ x: ind, y: val })
    if (opt.cumulative) {
      const c = new Uint32Array(props.hist.length)
      c[0] = props.hist[0]
      for (let i = 1; i < c.length; i++) {
        c[i] = c[i - 1] + props.hist[i]
      }
      return Array.from(c).map(trans)
    }
    return Array.from(props.hist).map(trans)
  })
  createEffect(() => {
    chart.changeData(data())
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
