import { createMemo, createSignal } from "solid-js";
import { match, P } from "ts-pattern";
import { GaussianCurve, GaussianCurveParam, getHist } from "../components/GaussianCurve";
import { HistBar } from "../components/HistBar";
import { ImagePreview } from "../components/ImagePreview";
import { ImageSelector } from "../components/ImageSelector";
import { histMatch } from "../libs/histMatch";
import style from './HistSpecification.module.css'
import imgUrl from '../assets/hist-match-demo.jpg'
import { histeq } from "../libs/histeq";
import { Flex, Text } from "@hope-ui/solid";

const initalParams: GaussianCurveParam = {
  leftXOffset: 0,
  rightXOffset: 0,
  crests: [
    { a: 1, b: 30, c: 8 },
    { a: 0.1, b: 200, c: 4 }
  ]
}
export function HistSpecification() {
  const [hist, setHist] = createSignal(
    getHist(initalParams)
  );
  const [image, setImage] = createSignal<ImageData | null>(null)
  const effect = createMemo(() => {
    const img = image()
    if (img) {
      const h = hist()
      const enhanced = histMatch(img, { r: h, g: h, b: h })
      const eq = histeq(img)
      return <div class={style.images}>
        <div>
          <Text>原图</Text>
          <ImagePreview image={img} />
          <HistBar image={img} channel="r" />
        </div>
        <div>
          <Text>直方图均衡</Text>
          <ImagePreview image={eq} />
          <HistBar image={eq} channel="r" />
        </div>
        <div>
          <Text>直方图匹配</Text>
          <ImagePreview
            image={enhanced}
          />
          <HistBar image={enhanced} channel="r" />
        </div>
      </div>
    }
    return null
  })

  return <div class={style.container}>
    <ImageSelector
      onSelect={setImage}
      options={[
        { label: 'Demo', url: imgUrl }
      ]}
    />
    <Flex>
      <GaussianCurve
        range={[0, 255]}
        initalParams={initalParams}
        onChange={curve => {
          setHist(getHist(curve))
        }}
      />
      <HistBar hist={hist()} />
    </Flex>

    {effect}
  </div>
}

