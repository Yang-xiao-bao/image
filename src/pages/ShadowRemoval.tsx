import { Progress, ProgressIndicator } from '@hope-ui/solid'
import { createEffect, createMemo, createResource, Match } from 'solid-js'
import { match, P } from 'ts-pattern'
import sample from '../assets/shadow-removal.png'
import { ImagePreview } from '../components/ImagePreview'
import { getImageData } from '../components/ImageSelector'
import { useSeparableConvolve } from '../hooks/useSeparableConvolve'
import { div } from '../libs/arithmetical'
import { gaussianFilter } from '../libs/gaussian'
import { histeq } from '../libs/histeq'
import { toImageData } from '../libs/image'
export function ShadowRemoval() {
  const [img] = createResource(
    () => getImageData(sample)
  )
  const [shadow, progress, process] = useSeparableConvolve()
  createEffect(() => {
    const image = img()
    if (image) {
      process(image, gaussianFilter(33))
    }
  })
  const result = createMemo(() => {
    const shadowImg = shadow()
    const image = img()
    if (shadowImg && image) {
      const r = toImageData(div(image, shadowImg, 0.1) as any)
      return r
      //return histeq(r)
    }
  })
  return <div>
    <Progress value={progress() * 100}>
      <ProgressIndicator />
    </Progress>
    {
      match(img())
        .with(P.not(P.nullish), (img) => <ImagePreview image={img} />)
        .otherwise(() => null)
    }
    {
      match(shadow())
        .with(P.not(P.nullish), (img) => <ImagePreview image={img} />)
        .otherwise(() => null)
    }
    {
      match(result())
        .with(P.not(P.nullish), (img) => <ImagePreview image={img} />)
        .otherwise(() => null)
    }
  </div>
}
