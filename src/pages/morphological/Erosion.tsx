import { createMemo, createResource } from "solid-js";
import imgUrl from "../../assets/erosion.png"
import { getImageData } from "../../components/ImageSelector";
import { toBinaryImageData, toImageData } from "../../libs/image";
import { ImagePreview } from "../../components/ImagePreview";
import { erode } from "../../libs/morphological/erode";
import { ones } from "../../libs/mat";

export function Erosion() {
  const [data] = createResource(() => getImageData(imgUrl))
  const result = createMemo(() => {
    const img = data()
    if (img) {
      const bin = toBinaryImageData(img)
      const result = erode(bin,{
        width:11,
        height:11,
        ox:5,
        oy:5,
        data: new Uint8Array(ones(11,11).get().flat())
      })
      return <div>
        <ImagePreview title="原图" image={toImageData(bin)} />
        <ImagePreview title="Erosion" image={toImageData(result)} />
      </div>
    }
    return <div>Loading...</div>
  })
  return <div>
    {result}
    <div>Erosion 会消除掉图像中的细小前景，具体的结果取决于结构元</div>
  </div>
}
