import { createSignal, sharedConfig } from "solid-js";
import { match, P } from "ts-pattern";
import { ImagePreview } from "../components/ImagePreview";
import { ImageSelector } from "../components/ImageSelector";
import moon from "../assets/moon.png"
import { ValueSelector } from "../components/ValueSelector";
import { ShowKernel } from "../components/ShowKernel";
import { laplacianSharpening } from "../libs/laplacianSharpening";
import { Input, InputGroup, InputLeftAddon } from "@hope-ui/solid";

const k1 = [
  [0, 1, 0],
  [1, -4, 1],
  [0, 1, 0]
]

const k2 = [
  [1, 1, 1],
  [1, -8, 1],
  [1, 1, 1]
]
const k3 = [
  [0, -1, 0],
  [-1, 4, -1],
  [0, -1, 0]
]
const k4 = [
  [-1, -1, -1],
  [-1, 8, -1],
  [-1, -1, -1]
]
export function LaplacianSharpening() {
  const [image, setImage] = createSignal<ImageData | null>(null);
  const [kernel, setKernel] = createSignal(k1)
  const [displayMode, setDisplayMode] = createSignal<'clamp' | 'remap'>('clamp')
  const [sharpenFactor, setSharpenFactor] = createSignal(1)
  return <div>
    <ImageSelector
      options={[{ url: moon, label: "moon" }]}
      defaultSelect="moon"
      onSelect={setImage}
    />
    <InputGroup>
      <InputLeftAddon>锐化系数</InputLeftAddon>
      <Input
        value={sharpenFactor()}
        step="0.1"
        type="number"
        onChange={e => {
          setSharpenFactor(e.currentTarget.valueAsNumber)
        }}
      />

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
    <ValueSelector<number[][]>
      items={[
        {
          label: "中心-4", value: k1
        },
        {
          label: "中心-8", value: k2
        },
        {
          label: "中心4", value: k3
        },
        {
          label: "中心8", value: k4
        }
      ]}
      value={kernel()}
      onChange={setKernel}
      label="选择核"
    />
    <ShowKernel kernel={kernel()} title="" />
    {match(image())
      .with(P.not(P.nullish), (img) => {
        const { convolveResult,
          origionalMinusConvolveResult,
          origionalAddConvolveResult
        } = laplacianSharpening(img, kernel(), sharpenFactor())
        return <div style={{
          display: 'grid',
          "grid-template-columns": "auto auto auto"
        }}>
          <ImagePreview title="原图" image={img} />
          <ImagePreview title="Laplacian图" image={{
            ...convolveResult,
            hit: displayMode()
          }} />
          <ImagePreview title="原图减Laplacian" image={{
            ...origionalMinusConvolveResult,
            hit: displayMode()
          }} />
          <ImagePreview title="原图加Laplacian" image={{
            ...origionalAddConvolveResult,
            hit: displayMode()
          }} />
        </div>
      })
      .otherwise(() => null)}
  </div>
}
