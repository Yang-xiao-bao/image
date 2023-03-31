import { getImageData } from '../components/ImageSelector'
import low from '../assets/einstein-low-contrast.png'
import med from '../assets/einstein-med-contrast.png'
import high from '../assets/einstein-high-contrast.png'
import { For, createResource, enableHydration } from 'solid-js'
import { ImagePreview } from '../components/ImagePreview'
import { HistBar } from '../components/HistBar'
import { statistics } from '../libs/statistics'
import style from './Statistics.module.css'
import { adjust } from '../libs/adjust'
import { stretchlim } from '../libs/stretchlim'

export function Statistics() {
  const [res] = createResource(
    () => Promise.all([
      getImageData(low),
      getImageData(med),
      getImageData(high)
    ]
    ))

  return <div>
    {
      res.loading
        ? 'loading'
        :
        <>
          <div class={style.itemContainer}>
            <span>原图(低、中、高对比度)</span>
            <span>对比度拉伸</span>
            <For each={res()!}>
              {(img: ImageData) => <><div class={style.item}>
                <ImagePreview image={img} />
                <HistBar image={img} channel="r" />
                <Info img={img} />
              </div>
                {(() => {
                  const [min, max] = stretchlim(img).r
                  const enhance = adjust(img, [min / 255, max / 255], [0, 1], 1)
                  return <div class={style.item}>
                    <ImagePreview image={enhance} />
                    <HistBar image={enhance} channel="r" />
                    <Info img={enhance} />
                  </div>
                })()}
              </>}
            </For>
          </div>
          结论：均值表征图像的亮度，方差表征图像的对比度
        </>
    }
  </div>
}
function Info(props: { img: ImageData }) {
  const info = statistics(props.img)
  return <div class={style.info}>
    <div>均值: {info.mean.r.toFixed(2)}</div>
    <div>方差: {info.variance.r.toFixed(2)}</div>
  </div>
}
