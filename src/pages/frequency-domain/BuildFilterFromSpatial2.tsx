import { createStore } from "solid-js/store"
import { ImagePreview } from "../../components/ImagePreview"
import { SurfaceViewer } from "../../components/SurfaceViewer"
import { dftSpectrum } from "../../libs/dftSpectrum"
import { complex, fft, getImage, ifft, translate } from "../../libs/fft2"
import { GrayImageData, toImageData } from "../../libs/image"
import { padRightBottom, padAround, takeLeftTop } from "../../libs/padding"
import { ControlPanel, ImageSelector } from "../../components/ControlPanel"
import { createMemo } from "solid-js"
import { mul } from "../../libs/complex-mul"
import { convolve } from "../../libs/convolve"

export function BuildFilterFromSpatial2() {
  type Params = {
    image?: GrayImageData
  }
  const store = createStore<Params>({})
  const filter = [
    [0, 0, 0, 0],
    [0, -1, 0, 1],
    [0, -2, 0, 2],
    [0, -1, 0, 1]
  ]
  const a = filter.flat()
  const processed = createMemo(() => {
    const img = store[0].image
    if (img) {
      const w = img.width
      const h = img.height
      const paddedFilter =
        padAround(
          complex({
            data: new Float32Array(a),
            width: 4,
            height: 4
          }),
          299,
          299,
          299,
          299
        )
      let fftData = fft(
        translate(
          paddedFilter.width / 2 | 0, paddedFilter.height / 2 | 0,
          paddedFilter
        ))
      // important
      fftData = translate(
        paddedFilter.width / 2 | 0, paddedFilter.height / 2 | 0,
        fftData)

      const spectrum = dftSpectrum(fftData)
      const imgFFT = fft(
        translate(
          paddedFilter.width / 2 | 0, paddedFilter.height / 2 | 0,
          padRightBottom(
            complex(img), 'zero',
            paddedFilter.width,
            paddedFilter.height
          ))
      )
      const processedImg = takeLeftTop(
        ifft(mul(fftData, imgFFT)),
        img.width, img.height
      )
      processedImg.hit = 'remap'
      return <>
        <ImagePreview image={spectrum} />
        <ImagePreview image={processedImg} />
        {/*
        <ImagePreview
          title="Sobal卷积"
          image={convolve(
            toImageData(img),
            filter
            // [[-1, 0, 1],
            // [-2, 0, 2],
            // [-1, 0, 1]]
          )} />
        */}
      </>
    }
  })


  return <div>
    <ControlPanel store={store}>
      <ImageSelector key="image" gray />
    </ControlPanel>
    {processed()}
  </div>
}
