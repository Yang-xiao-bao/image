import { createSignal } from "solid-js";
import { ImageSelector } from "../components/ImageSelector";
import moon from "../assets/moon.png"
import { match, P } from "ts-pattern";
import { ImagePreview } from "../components/ImagePreview";
import { unsharpMarking } from "../libs/unsharpMasking";
import { Input, InputGroup, InputLeftAddon } from "@hope-ui/solid";
import style from './UnsharpMasking.module.css'
import { CurveViewer } from "../components/CurveViewer";
import { FloatImageData, toImageData } from "../libs/image";

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
        onChange={e => setSigma(e.currentTarget.valueAsNumber)}
      />
    </InputGroup>
    <InputGroup>
      <InputLeftAddon>k</InputLeftAddon>
      <Input type="number"
        value={k()}
        onChange={e => setK(e.currentTarget.valueAsNumber)} />
    </InputGroup>
    {
      match(img())
        .with(P.not(P.nullish), img => {
          const r = unsharpMarking(img, sigma(), k())
          return <div class={style.container}>
            <div>
              <ImagePreview title="原图" image={img} />
              <CurveViewer range={[0, img.width]} step={1} fn={getScanLineIndencity(img)} />
            </div>
            <div>
              <ImagePreview title="模糊" image={r.blurred} />
              <CurveViewer range={[0, img.width]} step={1} fn={getScanLineIndencity(r.blurred)} />
            </div>
            <div>
              <ImagePreview title="掩码" image={r.mask} />
              <CurveViewer range={[0, img.width]} step={1} fn={getScanLineIndencity(r.mask)} />
            </div>
            <div>
              <ImagePreview title="锐化" image={{ ...r.result, hit: 'clamp' }} />
              <CurveViewer range={[0, img.width]} step={1} fn={getScanLineIndencity(toImageData({
                ...r.result,
                hit: 'clamp'
              }))} />
            </div>
          </div>
        })
        .otherwise(() => null)
    }

  </div>;
}
function getScanLineIndencity(imgData: ImageData | FloatImageData) {
  const y = Math.floor(imgData.height / 2)
  return (x: number) => {
    return imgData.data[4 * (y * imgData.width + x)]
  }

}
