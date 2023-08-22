import { createStore } from "solid-js/store"
import { ControlPanel, ImageSelector, Slider } from "../../components/ControlPanel"
import moon from "../../assets/moon.png"
import { GrayImageData } from "../../libs/image"
import { createMemo } from "solid-js"
import { ImagePreview } from "../../components/ImagePreview"
import { unsharpMasking } from '../../libs/freqUnsharpMasking'
import { frequencyGuassianFilter } from "../../libs/frequency-gaussian"

export function UnsharpMasking() {
  const store = createStore<{
    k1: number,
    k2: number,
    D0: number,
    image?: GrayImageData
  }>({
    k1: 9, k2: 0.5,
    D0: 30,
  })
  const processed = createMemo(() => {
    const { image, k1, k2, D0 } = store[0]
    if (image) {
      const filter = frequencyGuassianFilter(image.width * 2, image.height * 2, D0)
      const { enhanded } = unsharpMasking(filter, image, k1, k2)
      return <div>
        <ImagePreview
          title="原图"
          image={image}
        />
        <ImagePreview
          title="锐化结果"
          image={{ ...enhanded, hit: 'remap' }}
        />
      </div>
    }
  })


  return <div>
    <ControlPanel store={store}>
      <ImageSelector
        key="image"
        gray
        options={[{ url: moon, label: "moon" }]}
        defaultSelect="moon"
      />
      <Slider
        title="K1"
        key="k1"
        min={0}
        max={10}
      />
      <Slider
        title="K2"
        key="k2"
        min={0.1}
        max={10}
      />
    </ControlPanel>
    {processed()}
  </div>
}
