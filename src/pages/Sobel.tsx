import { createSignal } from "solid-js";
import { match, P } from "ts-pattern";
import { ImagePreview } from "../components/ImagePreview";
import { ImageSelector } from "../components/ImageSelector";
import { abs, add, pow } from "../libs/arithmetical";
import { convolve } from "../libs/convolve";
import style from './Sobel.module.css'
import Bikes from '../assets/Bikesgray.jpg'
import { sobel } from "../libs/sobel";
import { ShowKernel } from "../components/ShowKernel";

export function Sobel() {
  const [image, setImage] = createSignal<ImageData | null>(null)
  return <div>
    <ImageSelector
      options={[
        {
          url: Bikes,
          label: "Bikes"
        }
      ]}
      defaultSelect={"Bikes"}
      onSelect={setImage}
    />
    <ShowKernel
      title="水平方向"
      kernel={[
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
      ]}
    />
    <ShowKernel
      title="垂直方向"
      kernel={
        [
          [-1, 0, 1],
          [-2, 0, 2],
          [-1, 0, 1]
        ]
      } />
    <div class={style.container}>
      {match(image())
        .with(P.not(P.nullish), (img) => <ImagePreview image={img} title="原图" />)
        .otherwise(() => null)}
      {match(image())
        .with(P.not(P.nullish), (img) => {
          const { a, b, c } = sobel(img)
          return <>
            <ImagePreview image={a} title="水平（以及对角）方向的边缘" />
            <ImagePreview image={b} title="垂直（以及对角）方向的边缘" />
            <ImagePreview image={c} title="综合" />
          </>
        })
        .otherwise(() => null)}
    </div>
  </div>
}
