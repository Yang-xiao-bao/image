import { createSignal } from "solid-js";
import { ImagePreview } from "../../components/ImagePreview";
import { ImageSelector } from "../../components/ImageSelector";
import { sub } from "../../libs/arithmetical";
import { convolve } from "../../libs/convolve";
import { dftSpectrum, recontructBySpectrum } from "../../libs/dftSpectrum";
import { fft } from "../../libs/fft";
import { gaussianFilter } from "../../libs/gaussian";
import { GrayImageData, toGrayImageData, toImageData } from "../../libs/image";
import { ones, create } from "../../libs/mat";
import { recontructFromPhaseAngle } from "../../libs/phaseAngle";
import { createZonePlate } from "../../libs/zonePlate";

export function FFT1() {
  const image = createZonePlate(256)
  const kernel = gaussianFilter(4)
  const lowPass = convolve(image, gaussianFilter(7))

  const unitPulse = create(kernel)
    .scale(0)
    .get()
  const y = ~~(kernel.length / 2)
  const x = ~~(kernel[0].length / 2)
  unitPulse[y][x] = 1
  const highPass = convolve(image,
    create(unitPulse)
      .add(
        create(kernel)
          .scale(-1)
      ).get()
  )
  const [img, setImage] = createSignal<GrayImageData | null>(null)
  return <div style={{
    display: 'grid',
    "grid-template-columns": 'auto auto'
  }}>
    {img()! && <ImagePreview title="DD" image={toImageData(img()!)} />}
    <ImagePreview image={image} />
    <ImagePreview
      image={dftSpectrum(fft(toGrayImageData(image), true), true)}
    />
    <ImagePreview
      image={lowPass}
    />
    <ImagePreview
      image={dftSpectrum(fft(toGrayImageData(lowPass), true), true)}
    />
    <ImagePreview
      image={highPass} />
    <ImagePreview
      image={dftSpectrum(fft(toGrayImageData(highPass), true), true)}
    />
  </div>
}
