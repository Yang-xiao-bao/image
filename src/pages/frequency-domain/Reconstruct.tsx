import { createMemo, createSignal } from "solid-js";
import { ImagePreview } from "../../components/ImagePreview";
import { ImageSelector } from "../../components/ImageSelector";
import { DFTData } from "../../libs/dft";
import { dftSpectrum } from "../../libs/dftSpectrum";
import { fft, ifft } from "../../libs/fft";
import { GrayImageData, toGrayImageData } from "../../libs/image";
import { recontructBySpectrum, recontructByPhaseAngle } from "../../libs/reconstruct";
import style from './Recontruct.module.css'

export function Reconstruct() {
  const [img, setImage] = createSignal<GrayImageData | null>(null)
  const dft = createMemo(() => {
    const image = img()
    if (image) {
      return fft(image, true)
    }
  })
  const ifftMag = createMemo(() => {
    const dftData = dft()
    if (dftData) {
      return recontructBySpectrum(dftData)
    }
  })
  const ifftAngle = createMemo(() => {
    const dftData = dft()
    if (dftData) {
      return recontructByPhaseAngle(dftData)
    }
  })

  return <div>
    <ImageSelector onSelect={
      img => setImage(toGrayImageData(img))
    } />
    <div class={style.container}>
      {img() && <ImagePreview image={img()!} title="原图" />}
      {dft()! && <ImagePreview image={dftSpectrum(dft()!, true)} title="频谱" />}
      {ifftAngle() && <ImagePreview image={ifftAngle()!} title="仅用相角重建图像" />}
      {ifftMag() && <ImagePreview image={ifftMag()!} title="仅用频谱重建图像" />}
    </div>
    <div>
      相角包含形状信息，频谱包含灰度信息。
    </div>
  </div>
}
