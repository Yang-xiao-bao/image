import { createStore } from "solid-js/store"
import { GrayImageData } from "../../libs/image"
import { createMemo } from "solid-js"
import { fft, ifft, translate } from "../../libs/fft2"
import { mul } from "../../libs/complex-ops"
import { ControlPanel, ImageSelector, Slider } from "../../components/ControlPanel"
import { ImagePreview } from "../../components/ImagePreview"
import { dftSpectrum } from "../../libs/dftSpectrum"
import { Flex } from "@hope-ui/solid"

export function BuildFilthrFromSpatial1() {
  type Params = {
    image?: GrayImageData,
    x: number,
    y: number
  }
  const store = createStore<Params>({
    x: 0.2,
    y: 0.2
  })
  const processed = createMemo(() => {
    const img = store[0].image
    let x = store[0].x
    let y = store[0].y
    if (img) {
      x = x * (img.width - 1) | 0
      y = y * (img.height - 1) | 0
      const filterData = new Float32Array(img.width * img.height)
      filterData[x + y * img.width] = 1.0
      let filter = fft({
        data: filterData,
        width: img.width,
        height: img.height
      })
      // 下行可使得最终图像原点位于左上角
      //filter = translate(x,y,filter)
      const imgFFT = fft(img)
      const processedImg = ifft(
        mul(imgFFT, filter)
      )
      return {
        filter: dftSpectrum(filter, true),
        processedImg
      }
    }
  })
  return <div>
    <ControlPanel store={store}>
      <ImageSelector key="image" gray />
      <Slider title="x" key="x" min={0} max={1} />
      <Slider title="y" key="y" min={0} max={1} />
    </ControlPanel>
    {processed() && <Flex>
      <ImagePreview image={processed()!.filter} />
      <ImagePreview image={processed()!.processedImg} />
    </Flex>}
    <div>
      空域的冲激函数的傅立叶变换作为频域的滤波器，冲激的位置就是滤波后图像的原点。
    </div>
  </div>
}
