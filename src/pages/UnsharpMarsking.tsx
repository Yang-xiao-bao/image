import { createSignal } from "solid-js";
import { ImageSelector } from "../components/ImageSelector";
import moon from "../assets/moon.png"
import { match, P } from "ts-pattern";
import { ImagePreview } from "../components/ImagePreview";
import { unsharpMarking } from "../libs/unsharpMarking";
import { Input, InputGroup, InputLeftAddon } from "@hope-ui/solid";
import style from './UnshaprMarsking.module.css'
import { createZonePlate } from "../libs/zonePlate";

export function UnsharpMasking() {
  const [sigma, setSigma] = createSignal(2)
  const [k, setK] = createSignal(2)
  const [img, setImage] = createSignal<ImageData | null>(null)
  return <div>
    <ImageSelector
      options={[{ label: "Moon", url: moon }]}
      onSelect={setImage}
    />
    <InputGroup>
      <InputLeftAddon>sigma</InputLeftAddon>
      <Input type="number"
        value={sigma()}
        onChange={e=>setSigma(e.currentTarget.valueAsNumber)}
      />
    </InputGroup>
    <InputGroup>
      <InputLeftAddon>k</InputLeftAddon>
      <Input type="number"
        value={k()}
        onChange={e=>setK(e.currentTarget.valueAsNumber)}/>
    </InputGroup>
    <ImagePreview image={createZonePlate(300)}/>
    <ImagePreview image={createZonePlate(500)}/>
    {
      match(img())
        .with(P.not(P.nullish), img => {
          const r = unsharpMarking(img, sigma(), k())
          return <div class={style.container}>
            <ImagePreview title="原图" image={img} />
            <ImagePreview title="模糊" image={r.blurred} />
            <ImagePreview title="掩码" image={r.mask} />
            <ImagePreview title="锐化" image={{ ...r.result, hit: 'clamp' }} />
          </div>
        })
        .otherwise(() => null)
    }

  </div>;
}
