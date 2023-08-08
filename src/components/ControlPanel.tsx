import { Input, InputGroup, InputLeftAddon } from "@hope-ui/solid"
import { JSXElement, useContext, createContext } from "solid-js"
import { createStore, SetStoreFunction } from "solid-js/store"
import { effect } from "solid-js/web"
import { toGrayImageData } from "../libs/image"
import { ImageSelector as ImgSelector } from "./ImageSelector"

export type ControlPanelProps<T extends Record<string, any>> = {
  store: [T, SetStoreFunction<T>]
  children: JSXElement
}

const Context = createContext<[Record<string, any>, SetStoreFunction<Record<string, any>>]>()

export function ControlPanel<T extends Record<string, any>>(props: ControlPanelProps<T>) {
  return <Context.Provider value={props.store as any}>
    {props.children}
  </Context.Provider>
}

export function Slider<K extends string>(props: {
  title: string,
  key: K
  min: number,
  max: number,
  step?: number
}) {
  const [state, setState] = useContext(Context)!
  const value = Number(state[props.key])
  return <InputGroup>
    <InputLeftAddon>
      {props.title}
    </InputLeftAddon>
    <Input
      min={props.min}
      max={props.max}
      step={props.step ?? (props.max - props.min) / 100}
      type="range"
      value={value}
      onChange={(e) => {
        setState(props.key, () => e.currentTarget.valueAsNumber)
      }}
    />
  </InputGroup>
}

export function ImageSelector(props: {
  key: string,
  gray?: boolean
}) {
  const [_, setState] = useContext(Context)!
  return <ImgSelector
    onSelect={(img) => {
      if (props.gray) {
        setState(props.key, toGrayImageData(img))
      } else {
        setState(props.key, img)
      }
    }}
  />
}
