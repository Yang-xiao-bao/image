import { createMemo, createResource } from 'solid-js'
import imgUrl from '../../assets/morph_sample.png'
import { getImageData } from '../../components/ImageSelector'
import { toBinaryImageData, toImageData } from '../../libs/image'
import { closing } from '../../libs/morphological/closing'
import { square } from '../../libs/morphological/se'
import { erode } from '../../libs/morphological/erode'
import { dilate } from '../../libs/morphological/dilation'
import { Flex } from '@hope-ui/solid'
import { ImagePreview } from '../../components/ImagePreview'
export function Closing() {
  const [data] = createResource(() => getImageData(imgUrl))
  const result = createMemo(() => {
    const img = data()
    if (img) {
      const bin = toBinaryImageData(img)
      const se = square(3);
      const result = closing(bin, se)
      const dilated = dilate(bin, se)
      const eroded = erode(dilated, se)
      return <Flex style={{ gap: "10px" }}>
        <ImagePreview title="原图" image={toImageData(bin)} />
        <ImagePreview title="膨胀" image={toImageData(dilated)} />
        <ImagePreview title="腐蚀(膨胀的结果)" image={toImageData(eroded)} />
        <ImagePreview title="开运算" image={toImageData(result)} />
      </Flex>
    }
    return <div>Loading...</div>
  })
  return <div>
    {result}
    <div>
      闭运算，先膨胀，再腐蚀。可以用于填充图像中的小孔，同时保留大孔和对象的形状和大小
    </div>
  </div>
}
