import { createMemo, createSignal } from "solid-js";
import { ImagePreview } from "../../components/ImagePreview";
import { SurfaceViewer } from "../../components/SurfaceViewer";
import { dftFilter } from "../../libs/dftFilter";
import { dftSpectrum } from "../../libs/dftSpectrum";
import { fft, ifft } from "../../libs/fft";
import { GrayImageData, toGrayImageData } from "../../libs/image";
import { ControlPanel, ImageSelector, Slider } from "../../components/ControlPanel";
import { createStore } from "solid-js/store";
import { Flex } from "@hope-ui/solid";
import style from './RingingArtifact.module.css'

export function RingingArtifact() {
  const store = createStore<{
    image?: GrayImageData
    radius: number
  }>({
    radius: 40
  })

  const processed = createMemo(() => {
    const image = store[0].image
    if (image) {
      const filter = lowPass(image.width, image.height, store[0].radius)
      const filtered = dftFilter(
        image,
        {
          origin: 'center',
          data: filter
        },
        'none'
      )
      return {
        filtered,
        filter,
      }
    }
  })
  const surface = createMemo(() => {
    const p = processed()
    if (p) {
      const { filter } = p
      const real = new Float32Array(filter.width * filter.height)
      for (let x = 0; x < filter.width; x++) {
        for (let y = 0; y < filter.height; y++) {
          real[y * filter.width + x] = (-1) ** (x + y) * filter.data[y * filter.width + x]
        }
      }
      const fftData = ifft({
        width: filter.width,
        height: filter.height,
        real: real,
        imag: new Float32Array(filter.height * filter.width),
        shifted: true
      })
      return <>
        <div>
          <div>频域滤波器</div>
          <SurfaceViewer
            x={[0, filter.width]}
            y={[0, filter.height]}
            steps={[1, 1]}
            z={(x, y) => filter.data[y * filter.width + x]}
          />
        </div>
        <div>
          <div>空域滤波器</div>
          <SurfaceViewer
            x={[0, filter.width]}
            y={[0, filter.height]}
            steps={[1, 1]}
            z={(x, y) => fftData.data[y * filter.width + x]}
          />
        </div>
        <ImagePreview
          class={style.img}
          title="空域滤波器图像"
          image={{
            ...fftData,
            hit: 'remap'
          }} />
      </>
    }
  })
  return <div>
    <ControlPanel store={store}>
      <ImageSelector gray key="image" />
      <Slider title="Filter半径" key="radius"
        min={0}
        max={100}
      />
    </ControlPanel>
    <Flex class={style.container} wrap="wrap">
      {processed() && <>
        <ImagePreview
          title="处理结果"
          image={processed()!.filtered}
          class={style.img}
        />

      </>}
      {surface()}
    </Flex>
    <div>
      理想低通滤波器导致的振铃效应
    </div>
  </div>
}

function lowPass(width: number, height: number, radius: number): GrayImageData {
  const data = new Float32Array(width * height)
  const cx = width / 2
  const cy = height / 2
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      data[y * width + x] = ((x - cx) ** 2 + (y - cy) ** 2) <= (radius ** 2) ? 1 : 0
    }
  }
  return {
    data,
    width,
    height,
    hit: 'remap'
  }
}
