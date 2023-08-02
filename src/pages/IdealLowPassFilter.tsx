import { createMemo, createResource } from 'solid-js'
import imageUrl from '../assets/sample.png'
import { getImageData } from '../components/ImageSelector'
import { ImagePreview } from '../components/ImagePreview'
import { GrayImageData, toGrayImageData } from '../libs/image'
import { ComplexMatrix, complex, fft, ifft, translate } from '../libs/fft2'
import { DFTData } from '../libs/dft'
import { idealLowpassFilter } from '../libs/ideal-lowpass'
import { mul } from '../libs/complex-mul'
import { padRightBottom, takeLeftTop } from '../libs/padding'
import style from './IdealLowPassFilter.module.css'

export function IdealLowPassFilter() {
  const [data] = createResource(
    () => getImageData(imageUrl)
  )
  return <>
    {createMemo(() => {
      const img = data()
      if (img) {
        const grayImg = toGrayImageData(img)
        const padded = padRightBottom(
          complex(grayImg),
          "mirror"
        )
        const imgFFT = fft(
          translate(
            padded.width / 2 | 0,
            padded.height / 2 | 0,
            padded),
        )
        return <div>
          <div class={style.container}>
            <ImagePreview title="原图" image={img} />
            <ImagePreview
              title="10px"
              image={applyFilter(imgFFT, 10)}
            />
            <ImagePreview
              title="30px"
              image={applyFilter(imgFFT, 30)}
            />
            <ImagePreview
              title="60px"
              image={applyFilter(imgFFT, 60)}
            />
            <ImagePreview
              title="160px"
              image={applyFilter(imgFFT, 160)}
            />
            <ImagePreview
              title="460px"
              image={applyFilter(imgFFT, 460)}
            />
          </div>
          <p>
          在30px,60px,160px 的滤波结果中均能观察到明显的“振铃效应”
          </p>
          <p>
          滤波器半径越小，过滤掉的高频越多，则图片越模糊
          </p>
        </div>
      }
      return "Loading"
    })}
  </>
}

function applyFilter(img: ComplexMatrix, radius: number) {
  const filter = idealLowpassFilter(img.width, img.height, radius)
  return takeLeftTop(ifft(mul(img, complex(filter))))
}
