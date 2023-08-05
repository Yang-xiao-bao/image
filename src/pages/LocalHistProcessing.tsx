import { createResource, createSignal } from 'solid-js'
import { InputGroup, Flex, Input, InputLeftAddon, Text } from '@hope-ui/solid'
import sample from '../assets/local-hist-processing.png'
import { ImagePreview } from '../components/ImagePreview'
import { getImageData } from '../components/ImageSelector'
import { localHistAdjust } from '../libs/localHist'
import { histeq } from '../libs/histeq'

export function LocalHistProcessing() {
  const [data] = createResource(() => getImageData(sample))
  const [c, setC] = createSignal(22.8)


  return (
    <div>
      <InputGroup>
        <InputLeftAddon>提亮倍数</InputLeftAddon>
        <Input type="number" value={c()} onInput={e => setC(e.currentTarget.valueAsNumber)} />
      </InputGroup>
      {data.loading
        ? <div>Loading...</div>
        : (() => {
          const img = data()!
          const r = localHistAdjust(img, 3, c(),
            [0, 0.1],
            [0, 0.1]
          )
          return <Flex>
            <div>
              <Text>
                原图
              </Text>
              <ImagePreview image={img} />
            </div>
            <div>
              <Text>
                脂肪图均衡
              </Text>
              <ImagePreview image={histeq(img)} />
            </div>
            <div>
              <Text>
                效果图
              </Text>
              <ImagePreview image={r} />
            </div>
          </Flex>
        })()}
    </div>
  )
}
