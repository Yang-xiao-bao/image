import { createMemo, createSignal } from "solid-js";
import { ImagePreview } from "../../components/ImagePreview";
import { ImageSelector } from "../../components/ImageSelector";
import { dftSpectrum } from "../../libs/dftSpectrum";
import { fft, ifft } from "../../libs/fft";
import { GrayImageData, toGrayImageData } from "../../libs/image";

export function FFT_IFFT() {
  const [img, setImage] = createSignal<GrayImageData>()
  return <div>
    <ImageSelector
      onSelect={(data) => {
        setImage(toGrayImageData(data))
      }}
    />
    {
      createMemo(() => {
        const image = img()
        if (image) {
          const dft = fft(image,false)
          const i = ifft(dft)
          console.log(image,i)
          return <>
            <ImagePreview image={image} />
            <ImagePreview
              image={dftSpectrum(dft,true)}
            />
            <ImagePreview
              image={i}
            />
          </>
        }
      })
    }
  </div>
}
