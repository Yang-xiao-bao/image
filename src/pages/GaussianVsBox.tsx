import { createEffect, createResource, Match } from 'solid-js'
import url from '../assets/gaussian-vs-box.png'
import { useSeparableConvolve } from '../hooks/useSeparableConvolve'
import { getImageData } from '../components/ImageSelector'
import { gaussianFilter } from '../libs/gaussian'
import { boxFilter } from '../libs/box-filter'
import { Progress, ProgressIndicator } from '@hope-ui/solid'
import { match, P } from 'ts-pattern'
import { ImagePreview } from '../components/ImagePreview'
import style from './GaussianVsBox.module.css'
import { FloatImageData } from '../libs/image'
import { CurveViewer } from '../components/CurveViewer'

export function GaussianVsBox() {
  const [gaussianImg, p1, processGaussian] = useSeparableConvolve()
  const [boxImage, p2, processBoxKernel] = useSeparableConvolve()
  const [data] = createResource(
    () => getImageData(url)
  )
  createEffect(() => {
    const img = data()
    if (img) {
      processGaussian(
        img,
        gaussianFilter(12.5)
      )
      processBoxKernel(img, boxFilter(41).get())
    }
  })
  return <div>
    <Progress value={(p1() + p2()) / 2 * 100}>
      <ProgressIndicator />
    </Progress>
    <div class={style.previewContainer} >
      {
        match(data())
          .with(P.not(P.nullish), (img) => {
            return <div>
              <div>原图</div>
              <ImagePreview image={img} />
              <CurveViewer range={[0, img.width - 1]} step={1} fn={getScanLineIndencity(img)} />
            </div>
          })
          .otherwise(() => null)
      }
      {
        match(gaussianImg())
          .with(P.not(P.nullish), (img) => {
            return <div>
              <div>高斯滤波器</div>
              <ImagePreview image={img} />
              <CurveViewer range={[0, img.width - 1]} step={1} fn={getScanLineIndencity(img)} />
            </div>
          })
          .otherwise(() => null)
      }
      {
        match(boxImage())
          .with(P.not(P.nullish), (img) => {
            return <div>
              <div>盒式滤波器</div>
              <ImagePreview image={img} />
              <CurveViewer range={[0, img.width - 1]} step={1} fn={getScanLineIndencity(img)} />
            </div>
          })
          .otherwise(() => null)
      }
    </div>
  </div>
}

function getScanLineIndencity(imgData: ImageData | FloatImageData) {
  const y = Math.floor(imgData.height / 2)
  return (x: number) => {
    return imgData.data[4 * (y * imgData.width + x)]
  }

}
