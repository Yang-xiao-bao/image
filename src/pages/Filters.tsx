import { createEffect, createMemo, createSignal } from "solid-js";
import { ImagePreview } from "../components/ImagePreview";
import { boxFilter } from "../libs/box-filter";
import { createZonePlate } from "../libs/zonePlate";
import { Input } from '@hope-ui/solid'
import { useSeparableConvolve } from "../hooks/useSeparableConvolve";
import { gaussianFilter } from "../libs/gaussian";
import { create } from "../libs/mat";
import { sub } from "../libs/arithmetical";
import style from './Filters.module.css'

export function Filters() {
  const img = createZonePlate(300)
  return <div>
    <div>
      比较高斯核和盒式核，盒式核产生了“方”的结果。测试图像的空间频率随着到中心的距离曾大而增大
    </div>
    <Box img={img} />
    <Gaussian img={img} />
  </div>
}

function Box(props: { img: ImageData }) {
  const [size, setSize] = createSignal(11)
  const [data, pregress, process] = useSeparableConvolve()
  createEffect(() => {
    process(
      props.img,
      boxFilter(size()).get()
    )
  })

  return <div>
    <Input type="number" value={size()} onChange={e => setSize(e.currentTarget.valueAsNumber)} />

    <div class={style.row}>

      {data() != null && <ImagePreview title="盒式核" image={data()!} />}
      <HighPass img={props.img}
        lowPassFilter={
          boxFilter(size()).get()
        }
      />
    </div>
  </div>

}
function Gaussian(props: { img: ImageData }) {
  const [size, setSize] = createSignal(4)
  const [data, pregress, process] = useSeparableConvolve()
  createEffect(() => {
    process(
      props.img,
      gaussianFilter(size())
    )
  })

  return <div>
    <Input type="number" value={size()} onChange={e => setSize(e.currentTarget.valueAsNumber)} />
    <div class={style.row}>
      {data() != null && <ImagePreview title="高斯核" image={data()!} />}
      <HighPass img={props.img}
        lowPassFilter={gaussianFilter(size())}
      />
    </div>
  </div>
}
function HighPass(props: { img: ImageData, lowPassFilter: number[][] }) {

  const [data, pregress, process] = useSeparableConvolve()
  const [filtered, _, processFilter] = useSeparableConvolve()
  createEffect(() => {
    const unitPulse = create(props.lowPassFilter)
      .scale(0)
      .get()
    const y = ~~(props.lowPassFilter.length / 2)
    const x = ~~(props.lowPassFilter[0].length / 2)
    unitPulse[y][x] = 1

    process(
      props.img,
      create(unitPulse)
        .add(create(props.lowPassFilter).scale(-1)).get()
    )
  })
  createEffect(() => {
    processFilter(
      props.img,
      props.lowPassFilter
    )
  })

  return <>
    {data() != null && <ImagePreview
      title="高通（高通滤波器由低通滤波器计算得到）滤波结果"
      image={{
        ...data()!,
        hit: 'clamp'
      }} />}
    {

      createMemo(() => {
        const lowPassFilterImg = filtered()
        if (lowPassFilterImg) {
          // 高通滤波结果 = 原图 - 低通滤波结果
          const img = sub(
            props.img,
            lowPassFilterImg
          )
          return <ImagePreview
            title="原图减去低通滤波结果"
            image={{ ...img, hit: 'clamp' }} />
        }
      })
    }

  </>
}
