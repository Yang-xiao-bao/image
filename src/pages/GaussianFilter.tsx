import { Input, InputGroup, InputLeftAddon, Progress, ProgressIndicator } from "@hope-ui/solid";
import { createEffect, createMemo, createSignal } from "solid-js";
import { ImagePreview } from "../components/ImagePreview";
import { ImageSelector } from "../components/ImageSelector";
import { ShowKernel } from "../components/ShowKernel";
import { useSeparableConvolve } from "../hooks/useSeparableConvolve";
import { gaussianFilter } from '../libs/gaussian'
import style from './BoxFilter.module.css'

export function GaussianFilter() {
  const [size, setSize] = createSignal(20)
  const [img, setImage] = createSignal<ImageData>()
  const [result, progress, process] = useSeparableConvolve()
  const kernel = createMemo(() => {
    return gaussianFilter(size() / 6)
  })
  createEffect(() => {
    const image = img()
    if (image) {
      process(image, kernel())
    }
  })
  const progressBar = createMemo(() => {
    const p = progress()
    if (p > 0 && p < 1) {
      return <Progress value={p * 100} >
        <ProgressIndicator />
      </Progress>
    }
    return null
  })

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
        value={size()}
        onChange={e => {
          setSize(e.currentTarget.valueAsNumber)
        }}
      />
    </InputGroup>
    <ShowKernel title="高斯滤波器" kernel={kernel()} />
    <div class={style.container}>
      {createMemo(() => {
        const image = img()
        if (image) {
          return <ImagePreview image={image} />
        }
        return null
      })}
      {
        createMemo(() => {
          const image = result()
          if (image) {
            return <ImagePreview image={image} />
          }
          return null
        })
      }
    </div>
    {progressBar}
  </div>
}
