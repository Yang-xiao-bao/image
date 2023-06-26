import { Input, InputGroup, InputLeftAddon } from "@hope-ui/solid";
import { createMemo, createSignal } from "solid-js";
import { ImagePreview } from "../../components/ImagePreview";
import { ImageSelector } from "../../components/ImageSelector";
import { SurfaceViewer } from "../../components/SurfaceViewer";
import { dftSpectrum } from "../../libs/dftSpectrum";
import { GrayImageData, toGrayImageData } from "../../libs/image";
import { fft, getImage, ifft, translate } from "../../libs/fft2";
import style from './TranslateOrigin.module.css'

export function TranslateOrigin() {
  const [image, setImage] = createSignal<GrayImageData>()
  const [x, setX] = createSignal<number>(0)
  const [y, setY] = createSignal<number>(0)
  const fftPlot = createMemo(() => {
    const img = image()
    if (img) {
      const fftData = fft(translate(
        x(), y(),
        img
      ))
      const spectrum = dftSpectrum(fftData, true)


      return <div class={style.container}>
        <ImagePreview image={spectrum} />
        <ImagePreview image={ifft(fftData)} />
        <SurfaceViewer
          x={[0, img.width]}
          y={[0, img.height]}
          steps={[1, 1]}
          z={(x, y) => spectrum.data[y * img.width + x]}
        />
      </div>
    }
  })
  return <div> 
    <ImageSelector onSelect={img => {
      setImage(toGrayImageData(img))
    }}
    />
    <InputGroup>
      <InputLeftAddon>
        X
      </InputLeftAddon>
      <Input min={0} max={image()?.width ?? 0} value={x()} type="range" onChange={e => setX(e.currentTarget.valueAsNumber)} />
    </InputGroup>
    <InputGroup>
      <InputLeftAddon>
        Y
      </InputLeftAddon>
      <Input min={0} max={image()?.height ?? 0} value={y()} type="range" onChange={e => setY(e.currentTarget.valueAsNumber)} />
    </InputGroup>
    {fftPlot}
  </div>
}
