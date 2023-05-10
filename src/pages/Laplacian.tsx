import { Input, Flex, InputGroup, InputLeftAddon } from "@hope-ui/solid";
import { createEffect, createMemo, createSignal } from "solid-js";
import { match, P } from "ts-pattern";
import { ImagePreview } from "../components/ImagePreview";
import { ImageSelector } from "../components/ImageSelector";
import { ShowKernel } from "../components/ShowKernel";
import { ValueSelector } from "../components/ValueSelector";
import { useAsyncConvolve } from "../hooks/useAsyncConvolve";
import { laplacianFilter } from "../libs/laplacian";
import moon from "../assets/moon.png"

export function Laplacian() {
  const [img, setImage] = createSignal<ImageData>()
  const [result, _, process] = useAsyncConvolve()
  const [alpha, setAlpha] = createSignal(0)
  const [displayMode, setDisplayMode] = createSignal<'clamp' | 'remap'>('clamp')
  const filter = createMemo(() => {
    return laplacianFilter(alpha())
  })
  createEffect(() => {
    const image = img()
    if (image) {
      process(image, filter())
    }
  })
  return <div>
    <ImageSelector
      onSelect={setImage}
      options={[{ url: moon, label: "moon" }]}
      defaultSelect="moon"
    />
    <InputGroup>
      <InputLeftAddon>Alpha</InputLeftAddon>
      <Input value={alpha()} onChange={e => setAlpha(e.currentTarget.valueAsNumber)} type="number" />
    </InputGroup>
    <ValueSelector<'clamp' | 'remap'>
      label="显示方式"
      items={[
        { label: "夹断", value: "clamp" },
        { label: "重映射", value: "remap" }
      ]}
      onChange={setDisplayMode}
      value={displayMode()}
    />
    <ShowKernel
      title="拉普拉斯滤波器核"
      kernel={filter()}
    />
    <Flex>
      {match(img())
        .with(P.not(P.nullish), (img) => {
          return <ImagePreview
            image={img}
          />
        })
        .otherwise(() => null)}
      {match(result())
        .with(P.not(P.nullish), (img) => {
          return <ImagePreview
            image={{
              ...img,
              hit: displayMode()
            }}
          />
        })
        .otherwise(() => null)}
    </Flex>

  </div>
}
