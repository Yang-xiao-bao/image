import { createMemo, createResource } from "solid-js";
import imgUrl from "../../assets/erosion.png"
import { getImageData } from "../../components/ImageSelector";
import { toBinaryImageData, toImageData } from "../../libs/image";
import { ImagePreview } from "../../components/ImagePreview";
import { erode } from "../../libs/morphological/erode";
import { ones } from "../../libs/mat";
import { Flex } from "@hope-ui/solid";
import { createStore } from "solid-js/store";
import { ControlPanel, Selector } from "../../components/ControlPanel";
import { match } from "ts-pattern";
import { square } from "../../libs/morphological/se";

export function Erosion() {
  const store = createStore<{ se: 'square' | 'v-line' | 'h-line' }>({
    se: 'square'
  })
  const [data] = createResource(() => getImageData(imgUrl))
  const result = createMemo(() => {
    const img = data()
    const se = match(store[0])
      .with({ se: 'square' }, () => (square(7)))
      .with({ se: 'v-line' }, () => ({
        width: 1,
        height: 11,
        ox: 0,
        oy: 5,
        data: new Uint8Array(ones(1, 11).get().flat())
      }))
      .with({ se: 'h-line' }, () => ({
        width: 11,
        height: 1,
        ox: 5,
        oy: 0,
        data: new Uint8Array(ones(11, 1).get().flat())
      }))
      .run()
    if (img) {
      const bin = toBinaryImageData(img)
      const result = erode(bin, se)
      return <Flex>
        <ImagePreview title="原图" image={toImageData(bin)} />
        <ImagePreview title="Erosion" image={toImageData(result)} />
      </Flex>
    }
    return <div>Loading...</div>
  })
  return <div>
    <ControlPanel store={store}>
      <Selector
        title="结构元"
        key="se"
        options={[
          {
            label: '方形',
            value: 'square',
          },
          {
            label: '横线',
            value: 'h-line',
          },
          {
            label: '竖线',
            value: 'v-line',
          }
        ]}
      />
    </ControlPanel>
    {result}
    <div>Erosion 会消除掉图像中的细小前景，具体的结果取决于结构元</div>
  </div>
}
