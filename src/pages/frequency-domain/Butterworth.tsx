import { createStore } from "solid-js/store";
import { GrayImageData } from "../../libs/image";
import { createMemo } from "solid-js";
import { butterworth } from "../../libs/butterworth";
import { complex, fft, ifft, translate } from "../../libs/fft2";
import { padRightBottom, takeLeftTop } from "../../libs/padding";
import { mul } from "../../libs/complex-mul";
import { ImagePreview } from "../../components/ImagePreview";
import { ControlPanel, ImageSelector, Slider } from "../../components/ControlPanel";
import { CurveViewer } from "../../components/CurveViewer";
import { Text } from "@hope-ui/solid";
export function Butterworth() {

  const store = createStore<{
    image?: GrayImageData,
    radius: number,
    n: number
  }>({
    radius: 40,
    n: 1
  })
  const processed = createMemo(() => {
    const { image, radius, n } = store[0]
    if (!image) return
    const { width, height } = image
    const filter = butterworth(width * 2, height * 2, radius, n)
    const fftData = fft(
      translate(
        width, height,
        padRightBottom(
          complex(image),
          'mirror'
        ))
    )
    const filtered = mul(fftData, complex(filter))
    const ifftData = takeLeftTop(ifft(filtered))
    return <div>
      <ImagePreview
        image={ifftData}
      />
      <ImagePreview
        title={`${radius}`}
        image={filter}
      />
      <div>
        <Text>
          水平掊面曲线
        </Text>
        <CurveViewer
          range={[0, 2 * width - 1]}
          step={1}
          fn={x => filter.data[height * (2 * width) + x]}
        />
      </div>

    </div>
  })
  return <div>
    <ControlPanel store={store}>
      <ImageSelector key="image" gray />
      <Slider title="D" key="radius" min={10} max={60} />
      <Slider title="N" key="n" min={1} max={100}
        step={1}
      />
    </ControlPanel>
    {processed()}
    <div>
      N 越大，该Filter越接近理想低通滤波器，
      <br />
      N 越小，该Filter越接近高斯滤波器
      </div>
  </div>
}
