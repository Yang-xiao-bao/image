import { createSignal } from "solid-js";
import { ImageSelector } from "../components/ImageSelector";
import pollen from '../assets/pollen.png'
import { match, P } from "ts-pattern";
import { ImagePreview } from "../components/ImagePreview";
import { histeq } from "../libs/histeq";
import style from './HistEq.module.css'
import { HistBar } from "../components/HistBar";

export function HistEq() {
  const [image, setImage] = createSignal<ImageData>()
  return <div>
    <ImageSelector
      options={[{ label: '花粉', url: pollen }]}
      onSelect={setImage}
    />
    {match(image()).with(P.not(P.nullish), (img) => <div class={style.previewContainer}>
      <div>
        <ImagePreview image={img} title="原图" />
        <HistBar image={img} channel="all" />
      </div>
      <div>
        <ImagePreview image={histeq(img)} title="均衡后效果图" />
        <HistBar image={histeq(img)} channel="all" />
      </div>
    </div>)
      .otherwise(() => null)}
  </div>
}
