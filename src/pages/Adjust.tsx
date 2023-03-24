import { InputGroup, InputLeftAddon } from "@hope-ui/solid";
import { createMemo, createSignal } from "solid-js";
import { match, P } from "ts-pattern";
import { ImagePreview } from "../components/ImagePreview";
import { ImageSelector } from "../components/ImageSelector";
import { Slider } from "../components/Slider";
import { adjust } from "../libs/adjust";
import style from './Adjust.module.css'

export function Adjust() {
  const [input, setInput] = createSignal([0.2, 0.9])
  const [output, setOutput] = createSignal([0, 1])
  const [image, setImage] = createSignal<ImageData | null>(null)
  const [gamma, setGamma] = createSignal([1])
  const adjusted = createMemo(() => {
    const img = image()
    if (img) {
      return adjust(img, input() as [number, number], output() as [number, number], gamma()[0])
    }
  })
  return <div class={style.container}>
    <ImageSelector onSelect={setImage} />
    <InputGroup class={style.inputGroup}>
      <InputLeftAddon class={style.addon}>
        源亮度范围
      </InputLeftAddon>
      <div
        class={style.slider}
      >
        <Slider
          max={1}
          min={0}
          points={input()}
          onChange={setInput}
        />
      </div>
    </InputGroup>
    <InputGroup class={style.inputGroup}>
      <InputLeftAddon class={style.addon}>
        输出亮度范围
      </InputLeftAddon>
      <div
        class={style.slider}
      >
        <Slider
          max={1} min={0} points={output()} onChange={setOutput} />
      </div>
    </InputGroup>
    <InputGroup class={style.inputGroup}>
      <InputLeftAddon class={style.addon}>
        Gamma
      </InputLeftAddon>
      <div
        class={style.slider}
      >
        <Slider
          points={gamma()}
          max={4}
          min={0}
          onChange={setGamma}
        />
      </div>
    </InputGroup>
    {gamma()[0]}
    {
      match(image())
        .with(P.not(P.nullish), img => <>
          <ImagePreview image={img} />
          <ImagePreview image={adjusted()!} />
        </>)
        .otherwise(() => null)
    }
  </div>
}
