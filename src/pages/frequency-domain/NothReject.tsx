import { ImagePreview } from "../../components/ImagePreview";
import { butterworthNothReject } from '../../libs/notchReject'
import imgUrl from '../../assets/moire.png'
import { createMemo, createResource } from "solid-js";
import { getImageData } from "../../components/ImageSelector";
import { toGrayImageData } from "../../libs/image";
import { complex, fft, ifft, translate } from "../../libs/fft2";
import { dftSpectrum } from "../../libs/dftSpectrum";
import { mul } from "../../libs/complex-ops";
import { Flex } from "@hope-ui/solid";

export function NotchRejct() {

  const [data] = createResource(
    () => getImageData(imgUrl)
      .then(toGrayImageData)
  )
  const img = createMemo(() => {
    const img = data()
    if (img) {
      const fftData = fft(
        translate(img.width / 2 | 0, img.height / 2 | 0, img))
      const filter = butterworthNothReject(img.width, img.height, [
        [30, 40],
        [-30, 40],
        [30, 80],
        [-30, 80],
        [30, 120],
        [-30, 120],
        [30, 160],
        [-30, 160],
        //[-50, 50]
      ], 10, 2)
      const filtered = mul(fftData, complex(filter))
      const enhance = ifft(filtered)
      return <Flex wrap="wrap">
        <ImagePreview title="原图"
          image={img}
        />
        <ImagePreview title="频谱"
          image={dftSpectrum(fftData, true)}
        />
        <ImagePreview title="Notch Reject Filter"
          image={filter}
        />
        <ImagePreview title="滤波后的频谱"
          image={dftSpectrum(filtered, true)}
        />
        <ImagePreview title="Enhanced"
          image={enhance}
        />
      </Flex>
    }

  })

  return <div>
    {img}
  </div>
}
