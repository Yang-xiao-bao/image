import { createMemo, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { ImagePreview } from "../../components/ImagePreview";
import { fft, ifft } from "../../libs/fft";
import { GrayImageData, toGrayImageData } from "../../libs/image";
import { ControlPanel, ImageSelector, Slider } from '../../components/ControlPanel'
import style from './DC.module.css'

export function DC() {
  const store = createStore<{
    image?: GrayImageData,
    percentage: number
  }>({
    percentage: 100
  })
  const processed = createMemo(() => {
    const image = store[0].image
    const percentage = store[0].percentage / 100
    if (image) {
      const fftData = fft(image)
      fftData.real[0] *= percentage
      fftData.imag[0] *= percentage
      const ifftImg = ifft(fftData)
      return {
        ...ifftImg,
        hit: 'clamp' as 'clamp'
      }
    }
  })
  return <div>
    <ControlPanel store={store}>
      <ImageSelector key="image" gray />
      <Slider title="百分比" key="percentage" min={0} max={200} />
    </ControlPanel>
    <div class={style.container}>
    {store[0].image &&
      <ImagePreview title="原图" image={store[0].image} />
    }
    {processed() &&
      <ImagePreview title={`亮度为原图的${store[0].percentage.toFixed(2)}%`} image={processed()!} />
    }
    </div>
    <div>DC(直流分量)代表了图片的平均亮度,调节DC可以调节图片的平均亮度</div>
  </div>
}
