import { Input, Flex, InputGroup, InputLeftAddon } from "@hope-ui/solid";
import { createEffect, createMemo, createSignal } from "solid-js";
import { match, P } from "ts-pattern";
import { ImagePreview } from "../components/ImagePreview";
import { ImageSelector } from "../components/ImageSelector";
import { ShowKernel } from "../components/ShowKernel";
import { useAsyncConvolve } from "../hooks/useAsyncConvolve";
import { convolve } from "../libs/convolve";
import { toImageData } from "../libs/image";
import { laplacianFilter } from "../libs/laplacian";

export function Laplacian() {
  const [img, setImage] = createSignal<ImageData>()
  const [result, _, process] = useAsyncConvolve()
  const [alpha, setAlpha] = createSignal(0)
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
    />
    <InputGroup>
      <InputLeftAddon>Alpha</InputLeftAddon>
      <Input value={alpha()} onChange={e => setAlpha(e.currentTarget.valueAsNumber)} type="number" />
    </InputGroup>
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
              hit: 'remap'
            }}
          />
        })
        .otherwise(() => null)}
    </Flex>

  </div>
}
