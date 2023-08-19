import { createStore } from "solid-js/store";
import { GrayImageData } from "../../libs/image";
import { ControlPanel, ImageSelector, Selector, Slider } from "../../components/ControlPanel";
import { createMemo } from "solid-js";
import { idealLowpassFilter } from "../../libs/ideal-lowpass";
import { frequencyGuassianFilter } from "../../libs/frequency-gaussian";
import { butterworth } from "../../libs/butterworth";
import { Flex } from "@hope-ui/solid";
import { ImagePreview } from "../../components/ImagePreview";
import { padRightBottom, takeLeftTop } from "../../libs/padding";
import { complex, fft, ifft, translate } from "../../libs/fft2";
import { mul } from "../../libs/complex-ops";
import { match } from "ts-pattern";

function highPassFilter(filter: GrayImageData) {
  const r = {
    ...filter
  }
  r.data = new Float32Array(r.data.length)
  for (let i = 0; i < r.data.length; i++) {
    r.data[i] = 1 - filter.data[i]
  }
  return r
}

function applyFilter(img: GrayImageData, filter: GrayImageData) {
  const imgFFT = fft(
    translate(
      img.width,
      img.height,
      padRightBottom(complex(img), 'mirror'),
    )
  );
  return takeLeftTop(ifft(
    mul(
      imgFFT,
      complex(filter)
    )
  ))
}

export function HighPassFilter() {
  const store = createStore<{
    image?: GrayImageData,
    D: number,
    filterType: 'ideal' | 'gaussian' | 'butterwoth'
    display: 'clamp' | 'remap'
  }>({
    D: 60,
    filterType: 'ideal',
    display: 'remap'
  })
  const processed = createMemo(() => {
    const { image, D, display, filterType } = store[0]
    if (image != null) {
      const width = image.width * 2
      const height = image.height * 2
      const filter = match(filterType)
        .with('ideal', () => highPassFilter(idealLowpassFilter(width, height, D)))
        .with('gaussian', () => highPassFilter(frequencyGuassianFilter(width, height, D)))
        .with('butterwoth', () => highPassFilter(butterworth(width, height, D, 2)))
        .run()
      const result = applyFilter(image, filter)
      return <div>
        <Flex>
          <ImagePreview title="滤波器" image={filter} />
          <ImagePreview title="结果" image={{
            ...result, hit: display
          }} />
        </Flex>
      </div>
    }
  })

  return <div>
    <ControlPanel store={store}>
      <ImageSelector gray key="image" />
      <Slider title="半径" key="D" min={10} max={100} />
      <Selector
        key="filterType"
        title="滤波器"
        options={[
          { label: "理想高通", value: "ideal" as const },
          { label: "高斯高通", value: "gaussian" as const },
          { label: "巴特沃斯高通", value: "butterwoth" as const },
        ]}
      />
      <Selector
        key="display"
        title="显示方式"
        options={[
          { label: "截断", value: "clamp" },
          { label: "重映射", value: "remap" }
        ]}

      />
    </ControlPanel>
    {processed()}
    <div>
      能从理性高通滤波结果观察到振铃效应
      </div>
  </div>

}
