import { createStore } from 'solid-js/store'
import { frequencyGuassianFilter } from '../../libs/frequency-gaussian'
import { Slider, ControlPanel } from '../../components/ControlPanel'
import { createMemo } from 'solid-js'
import { ImagePreview } from '../../components/ImagePreview'
import { CurveViewer } from '../../components/CurveViewer'
import { SurfaceViewer } from '../../components/SurfaceViewer'
import { Flex } from '@hope-ui/solid'

export function ViewGuassianFilter() {
  const store = createStore({ sigma: 10, width: 300, height: 300 })
  const img = createMemo(() => {
    const params = store[0]
    return frequencyGuassianFilter(params.width, params.height, params.sigma)
  })
  return <div>
    <ControlPanel store={store}>
      <Slider min={100} max={500} title="Width" key="width" />
      <Slider min={100} max={500} title="Height" key="height" />
      <Slider min={1} max={50} title="Sigma" key="sigma" />
    </ControlPanel>
    <Flex>
      <ImagePreview image={img()} />
      <SurfaceViewer
        steps={[1, 1]}
        x={[0, store[0].width - 1]}
        y={[0, store[0].height - 1]}
        z={(x, y) => {
          return img().data[y * store[0].width + x]
        }}
      />
    </Flex>
  </div>
}
