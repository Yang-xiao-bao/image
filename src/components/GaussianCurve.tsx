import { Button, Input, InputAddon, InputGroup, InputLeftAddon, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, VStack } from "@hope-ui/solid"
import { AiOutlineMore } from "solid-icons/ai"
import { createMemo, createSignal, For } from "solid-js"
import { CurveViewer } from "./CurveViewer"
import style from './GaussianCurve.module.css'

export type GaussianCurveParam = {
  a: number
  b: number
  c: number
}
export type GaussianCurveProps = {
  range: [number, number]
  step: number
}
export function GaussianCurve(props: GaussianCurveProps) {
  const [params, setParams] = createSignal<GaussianCurveParam[]>([
    { a: 1, b: 0, c: 1 },
  ])
  const curveViewerProps = createMemo(() => {
    const ps = params()
    const [first, ...rest] = ps
    const range = calcuRange(first)
    for (let p of rest) {
      const [min, max] = calcuRange(p)
      range[0] = Math.min(range[0], min)
      range[1] = Math.max(range[1], max)
    }
    const step = (range[1] - range[0]) / 1000
    return {
      range,
      step,
      fn: (x: number) => {
        let y = 0
        for (const param of ps) {
          const { a, b, c } = param
          y += a * Math.exp(
            -(((x - b) / c) ** 2) / 2
          )
        }
        return y
      }
    }
  })

  return <div class={style.container}>
    <ParamsEditor params={params()} onChange={setParams} />
    <CurveViewer
      {...curveViewerProps()}
    />
  </div>
}
function calcuRange(param: GaussianCurveParam) {
  const { a, b, c } = param
  const d = Math.sqrt(-2 * c ** 2 * Math.log(0.0001 / a))
  return [b - d, b + d] as [number, number]
}

function ParamsEditor(props: {
  params: GaussianCurveParam[]
  onChange: (ps: GaussianCurveParam[]) => void
}) {
  const [opened, setOpened] = createSignal(false)
  return <Popover opened={opened()}>
    <PopoverTrigger class={style.menu} onClick={() => setOpened(true)}>
      <AiOutlineMore />
    </PopoverTrigger>
    <PopoverContent>
      <PopoverArrow />
      <PopoverCloseButton onClick={() => setOpened(false)} />
      <PopoverBody>
        <VStack spacing="4px">
          <For each={props.params}>
            {(param, index) => <ParamEditor
              param={param}
              onChange={param => {
                const ps = props.params.slice()
                ps[index()] = param
                props.onChange(ps)
              }}
            />}
          </For>
          <Button
            onClick={() => {
              const last = props.params[props.params.length - 1]
              const r = calcuRange(last)
              props.onChange([
                ...props.params,
                { a: 1, b: r[1] + 1, c: 1 }
              ])
            }}
            size="xs"
          >
            添加
          </Button>
        </VStack>
      </PopoverBody>
    </PopoverContent>
  </Popover>
}
function ParamEditor(props: {
  param: GaussianCurveParam
  onChange: (param: GaussianCurveParam) => void
}) {
  return <div class={style.inputAddon} >
    <InputGroup size="xs">
      <InputLeftAddon>
        波峰高度
      </InputLeftAddon>
      <Input
        type="number"
        min={0.001}
        step={0.1}
        value={props.param.a}
        onChange={e => {
          const value = Number(e.currentTarget.value) || props.param.a
          if (value !== props.param.a) {
            props.onChange({
              ...props.param,
              a: value
            })
          }
        }}
      />
    </InputGroup>
    <InputGroup size="xs">
      <InputLeftAddon>
        X 偏移
      </InputLeftAddon>
      <Input
        type="number"
        value={props.param.b}
        step={0.1}
        onChange={
          e => {
            const value = Number(e.currentTarget.value) || props.param.b
            if (value !== props.param.a) {
              props.onChange({
                ...props.param,
                b: value
              })
            }
          }
        }
      />
    </InputGroup>
    <InputGroup size="xs">
      <InputLeftAddon>
        胖瘦
      </InputLeftAddon>

      <Input type="number"
        value={props.param.c}
        min={0.001}
        step={0.1}
        onChange={
          e => {
            const value = Number(e.currentTarget.value) || props.param.c
            if (value !== props.param.a) {
              props.onChange({
                ...props.param,
                c: value
              })
            }
          }
        }
      />
    </InputGroup>
  </div>
}
