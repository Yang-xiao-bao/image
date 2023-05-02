import { createSignal } from "solid-js";
import { match, P } from "ts-pattern";
import { ImagePreview } from "../components/ImagePreview";
import { ImageSelector } from "../components/ImageSelector";
import { ValueSelector } from "../components/ValueSelector";
import { PaddingStrategy, padImage } from "../libs/padImage";

export function Padding() {
  const [img, setImage] = createSignal<ImageData>()
  const [strategy, setStrategy] = createSignal<PaddingStrategy>('zero')
  return <div>
    <ImageSelector
      onSelect={setImage}
    />
    <ValueSelector
      label="填充方式"
      items={[
        { label: "用零填充", value: 'zero' },
        { label: "复制边缘", value: "replicate" }
      ]}
      onChange={setStrategy}
      value={strategy()}
    />
    {match(img())
      .with(P.not(P.nullish), (img) => {
        return <div>
          <ImagePreview image={img} />
          <ImagePreview
            image={padImage(img, 21, 11, strategy())}
          />
        </div>
      })
      .otherwise(() => null)}
  </div>
}
