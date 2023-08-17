import { createMemo, createSignal } from "solid-js"
import { GrayImageData, toGrayImageData } from "../../libs/image"
import { ifft, fft, translate, complex, getImage } from "../../libs/fft2"
import { frequencyGuassianFilter } from "../../libs/frequency-gaussian"
import { mul } from "../../libs/complex-ops"
import { ImagePreview, ImagePreviewProps } from "../../components/ImagePreview"
import { padRightBottom, takeLeftTop, paddingCentric } from "../../libs/padding"
import { verticalBlur } from "./verticalBlur"
import { dftSpectrum } from "../../libs/dftSpectrum";
import { createStore } from "solid-js/store"
import { ControlPanel, ImageSelector, Slider } from "../../components/ControlPanel"
import { Flex } from "@hope-ui/solid"

export function WraparoundError() {
  type Params = {
    image?: GrayImageData
    blurSize: number
  }
  const store = createStore<Params>({
    blurSize: 10
  })
  const filter = createMemo(() => {
    const img = store[0].image
    const size = store[0].blurSize
    if (img) {
      return verticalBlur(
        img.width,
        img.height,
        size,
        //img.height / 50 | 0
      )
    }
  })
  const result = createMemo(() => {
    const img = store[0].image
    const f = filter()
    if (img && f) {
      const u = Math.floor(img.width / 2)
      const v = Math.floor(img.height / 2)
      console.log("UV", u, v)
      const fftData = fft(translate(u, v, img))
      console.log("FILTER", f)
      f.f.imag = new Float32Array(f.f.real.length)
      return ifft(
        mul(fftData, f.f)
      )
    }
  })
  const padded = createMemo(() => {
    const img = store[0].image
    const size = store[0].blurSize
    if (img) {
      const paddedImg = padRightBottom(complex(img), 'mirror')
      const u = Math.floor(paddedImg.width / 2)
      const v = Math.floor(paddedImg.height / 2)
      const fftData = fft(translate(u, v, paddedImg))
      const filter = verticalBlur(
        paddedImg.width,
        paddedImg.height,
        2 * size
      )
      return {
        paddedImg: getImage(paddedImg),
        processed: getImage(takeLeftTop(complex(ifft(mul(fftData, filter.f)))))
      }
    }

  })
  return <div>
    <ControlPanel store={store}>
      <ImageSelector key="image" gray />
      <Slider title="模糊半径" key="blurSize" min={10} max={100} />
    </ControlPanel>
    {/*filter() && <>
      <ImagePreview image={filter()!.s} />
      <ImagePreview image={dftSpectrum(filter()!.f, true)} />
    </>*/}
    <Flex>
      {result() &&
        <ImagePreview title="A" image={result()!} />}
      {padded() &&
        <>
          <ImagePreview title="B" image={padded()!.processed} />
        </>}
    </Flex>
    <div>
      <p>

        图A, 未做Padding,直接应用一个垂直方向的Blur filter,观察上边缘可以发现起受到了下边缘的影响（Wrap around)
      </p>
      <p>
        图B, 将图片宽高各扩大两倍，变换后再取左上角，以避免Wraparound 问题
      </p>
    </div>

  </div>
}
