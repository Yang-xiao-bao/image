import { createStore } from "solid-js/store";
import { ControlPanel, Slider } from "../../components/ControlPanel";
import { createMemo } from "solid-js";
import { butterworthBandreject, gaussianBandReject, idealBandReject } from "../../libs/bandreject";
import { ImagePreview } from "../../components/ImagePreview";
import { createZonePlate } from "../../libs/zonePlate";
import { GrayImageData, toGrayImageData } from "../../libs/image";
import { padRightBottom, takeLeftTop } from "../../libs/padding";
import { complex, fft, ifft, translate } from "../../libs/fft2";
import { mul } from "../../libs/complex-ops";
import { SurfaceViewer } from "../../components/SurfaceViewer";
import { Flex } from "@hope-ui/solid";
import { idealLowpassFilter } from "../../libs/ideal-lowpass";

export function Bandreject() {
  const store = createStore<{
    center: number,
    bandWidth: number,
  }>({
    center: 50,
    bandWidth: 10
  })
  const size = 200
  const image = toGrayImageData(createZonePlate(200))

  return <div>
    <ControlPanel store={store}>
      <Slider key="center"
        title="半径"
        min={1}
        max={size}
      />
      <Slider key="bandWidth"
        title="带宽"
        min={1}
        max={size}
      />
    </ControlPanel>
    {
      createMemo(() => {
        const { center, bandWidth } = store[0]
        const filter = idealBandReject(size * 2, size * 2, bandWidth,center)
        return <Flex>
          <ImagePreview
            title="理想带阻滤波器"
            image={filter}
          />
          <ImagePreview
            title="滤波结果"
            image={applyFilter(
              filter, image
            )}
          />
          <div>
            <div>
              滤波器透视图
            </div>
            <SurfaceViewer
              steps={[1, 1]}
              x={[0, 2 * size - 1]}
              y={[0, 2 * size - 1]}
              z={(x, y) => filter.data[x + y * (2 * size)]}
            />
          </div>
        </Flex>
      })
    }
  </div>

}
function applyFilter(filter: GrayImageData, image: GrayImageData) {
  const padded = padRightBottom(complex(image), 'mirror')
  const fftData = fft(translate(image.width, image.height, padded))
  return takeLeftTop(ifft(
    mul(fftData, complex(filter))
  ))
}
