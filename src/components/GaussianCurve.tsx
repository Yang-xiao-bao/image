import { Button, Input, InputAddon, InputGroup, InputLeftAddon, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, VStack } from "@hope-ui/solid"
import { AiOutlineMore } from "solid-icons/ai"
import { createMemo, createSignal, For } from "solid-js"
import { CurveViewer } from "./CurveViewer"
import style from './GaussianCurve.module.css'

export type GaussianCurveCrest = {
  a: number
  b: number
  c: number
}
export type GaussianCurveParam = {
  crests: GaussianCurveCrest[],
  leftXOffset: number
  rightXOffset: number
}

export type GaussianCurveProps = {
  range: [number, number]
  initalParams?: GaussianCurveParam
  onChange?: (params: GaussianCurveCrest[]) => void
}
export function GaussianCurve(props: GaussianCurveProps) {

  const [curve, setCurve] = createSignal<GaussianCurveParam>(props.initalParams ?? {
    leftXOffset: 0,
    rightXOffset: 0,
    crests: [{ a: 1, b: 0, c: 1 }]
  })

  const curveViewerProps = createMemo(() => {
    const ps = curve()
    const [first, ...rest] = ps.crests
    const curveRange = calcuRange(first, 0.0001, 0.0001)
    for (let p of rest) {
      const [min, max] = calcuRange(p, 0.0001, 0.0001)
      curveRange[0] = Math.min(curveRange[0], min)
      curveRange[1] = Math.max(curveRange[1], max)
    }
    curveRange[0] += ps.leftXOffset
    curveRange[1] += ps.rightXOffset
    const step = (curveRange[1] - curveRange[0]) / 1000
    return {
      range: curveRange, //props.range,
      step,
      fn: (x: number) => {
        let y = 0

        for (const param of ps.crests) {
          const { a, b, c } = param
          y += a * Math.exp(
            -(((x - b) / c) ** 2) / 2
          )
        }
        return y
      }
    }
  })
  const rangeStr = createMemo(() => {
    const r = curveViewerProps().range
    return `[${r[0]},${r[1]}]`
  })

  return <div class={style.container}>
    <ParamsEditor params={curve()} onChange={ps => {
      setCurve(ps)
    }} />
    <CurveViewer
      {...curveViewerProps()}
    />
    <div>
      Range: {rangeStr}
    </div>
  </div>
}
function linear(input: [number, number], output: [number, number]) {
  const inputLen = input[1] - input[0]
  const outputLen = output[1] - output[0]
  return (v: number) => {
    // (v - input[0])/inputLen = (V-output[0])/outputLen
    return output[0] + (v - input[0]) * outputLen / inputLen
  }
}
function calcuRange(param: GaussianCurveCrest, startY: number, endY: number) {
  const { a, b, c } = param
  const d = Math.sqrt(-2 * c ** 2 * Math.log(startY / a))
  const d1 = Math.sqrt(-2 * c ** 2 * Math.log(endY / a))
  return [b - d, b + d1] as [number, number]
}

function ParamsEditor(props: {
  params: GaussianCurveParam
  onChange: (ps: GaussianCurveParam) => void
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
          <div class={style.inputAddon}>
            <InputGroup size="xs">
              <InputLeftAddon>
                左端扩展
              </InputLeftAddon>
              <Input
                type="number"
                step={1}
                value={props.params.leftXOffset}
                onChange={e => {
                  const leftXOffset = +e.currentTarget.value || props.params.leftXOffset
                  props.onChange({
                    ...props.params,
                    leftXOffset
                  })
                }}
              />
            </InputGroup>
            <InputGroup size="xs">
              <InputLeftAddon>
                右端扩展
              </InputLeftAddon>
              <Input
                type="number"
                step={1}
                value={props.params.rightXOffset}
                onChange={e => {
                  const rightXOffset = +e.currentTarget.value || props.params.leftXOffset
                  props.onChange({
                    ...props.params,
                    rightXOffset
                  })
                }}
              />
            </InputGroup>

          </div>
          <For each={props.params.crests}>
            {(param, index) => <ParamEditor
              param={param}
              onChange={param => {
                const ps = props.params.crests.slice()
                ps[index()] = param
                props.onChange({
                  ...props.params,
                  crests: ps
                })
              }}
            />}
          </For>
          <Button
            onClick={() => {
              const last = props.params.crests[props.params.crests.length - 1]
              const r = calcuRange(last, 0.001, 0.001)
              props.onChange({
                ...props.params,
                crests: [
                  ...props.params.crests,
                  { a: 1, b: r[1] + 1, c: 1 }
                ]
              })
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
  param: GaussianCurveCrest
  onChange: (param: GaussianCurveCrest) => void
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
