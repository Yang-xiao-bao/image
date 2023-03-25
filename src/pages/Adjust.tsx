import { InputGroup, InputLeftAddon } from "@hope-ui/solid";
import { createMemo, createSignal } from "solid-js";
import { match, P } from "ts-pattern";
import { Highlight } from "../components/CodeBlock";
import { HistBar } from "../components/HistBar";
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
    <ImageSelector 
      defaultSelect="Lena Gray"
      onSelect={setImage}

    />
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
    <Highlight code={`adjust(img,[${input().join(',')}],[${output().join(',')}],${gamma()[0]})`} />
    {
      match(image())
        .with(P.not(P.nullish), img => <div class={style.preview}>
          <div>
            <ImagePreview image={img} />
            <HistBar image={img} channel="all" />
          </div>
          <div>
            <ImagePreview image={adjusted()!} />
            <HistBar image={adjusted()!} channel="all" />
          </div>
        </div>)
        .otherwise(() => null)
    }
  </div>
}
