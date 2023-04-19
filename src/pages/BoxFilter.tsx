import { Input, InputGroup, InputLeftAddon } from "@hope-ui/solid";
import { createMemo, createSignal } from "solid-js";
import { ImagePreview } from "../components/ImagePreview";
import { ImageSelector } from "../components/ImageSelector";
import { boxFilter } from "../libs/box-filter";
import { convolve } from "../libs/convolve";
import style from './BoxFilter.module.css'

export function BoxFilter() {
  const [size, setSize] = createSignal(7)
  const [img, setImage] = createSignal<ImageData>()

  return <div>
    <ImageSelector
      onSelect={setImage}
    />
    <InputGroup>
      <InputLeftAddon>Size</InputLeftAddon>
      <Input
        type="number"
        min={3}
        step={1}
        max={50}
        value={size()}
        onChange={e => {
          setSize(e.currentTarget.valueAsNumber)
        }}
      />
    </InputGroup>
    {
      createMemo(() => {
        const n = size()
        const image = img()
        if (image) {
          console.time('boxFilter')
          const blur = convolve(image, boxFilter(n).get())
          console.timeEnd("boxFilter")
          return <div class={style.container}>
            <ImagePreview image={image} />
            <ImagePreview image={blur} />

          </div>
        }
        return null
      })
    }

  </div>
}
