import { Input, InputGroup, InputLeftAddon } from "@hope-ui/solid";
import { createMemo, createSignal } from "solid-js";
import { ImagePreview } from "../../components/ImagePreview";
import { SurfaceViewer } from "../../components/SurfaceViewer";
import { dftSpectrum } from "../../libs/dftSpectrum";
import { GrayImageData, toGrayImageData } from "../../libs/image";
import { fft, getImage, ifft, translate } from "../../libs/fft2";
import style from './TranslateOrigin.module.css'
import { ControlPanel, Slider, ImageSelector } from "../../components/ControlPanel";
import { createStore } from "solid-js/store";

export function TranslateOrigin() {
  type Params = {
    x: number,
    y: number,
    img?: ImageData
  }
  const store = createStore<Params>({
    x: 0,
    y: 0,
  })
  const fftPlot = createMemo(() => {
    const param = store[0]
    const x = param.x;
    const y = param.y;
    const img = param.img
    if (img) {
      const fftData = fft(translate(
        x * img.width, y * img.height,
        toGrayImageData(img)
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
    <ControlPanel
      store={store}
    >
      <ImageSelector key="img" />
      <Slider
        title="X"
        min={0}
        key="x"
        max={1}
      />
      <Slider
        title="Y"
        min={0}
        key="y"
        max={1}
      />
    </ControlPanel>
    {fftPlot}
  </div>
}
