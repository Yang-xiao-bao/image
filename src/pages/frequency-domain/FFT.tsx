import { Flex, Input, InputGroup, InputLeftAddon, Progress, ProgressIndicator } from "@hope-ui/solid";
import { createMemo, createSignal } from "solid-js";
import { ImagePreview } from "../../components/ImagePreview";
import { DFTData } from "../../libs/dft";
import { fft } from '../../libs/fft'
import { createSample } from "../../libs/dftSample";
import { dftSpectrum } from "../../libs/dftSpectrum";
import { phaseAngle } from "../../libs/phaseAngle";
import style from './FFT.module.css'

export function FFT() {
  const size = 512
  const [rotation, setRotation] = createSignal(45)
  const [tx, setTx] = createSignal(0)
  const [ty, setTy] = createSignal(0)
  const [sx, setSx] = createSignal(1)
  const [sy, setSy] = createSignal(4)
  const [shift, setShift] = createSignal(true)
  const img = createMemo(() => {
    return createSample(
      size,
      tx(),
      ty(),
      sx(),
      sy(),
      rotation()
    )
  })
  const [dft, setDft] = createSignal<DFTData | null>(null)
  const handle = () => {
    setDft(fft(img(), shift()))
  }
  handle()


  return <div>
    <div>观察平移、旋转、形状对傅利叶频谱的影响</div>
    <InputGroup>
      <InputLeftAddon>水平平移</InputLeftAddon>
      <Input type="range" min={-size / 2} max={size / 2}
        value={tx()}
        onInput={e => setTx(e.currentTarget.valueAsNumber)}
        onChange={handle}
      />
    </InputGroup>
    <InputGroup>
      <InputLeftAddon>垂直平移</InputLeftAddon>
      <Input type="range" min={-size / 2} max={size / 2}
        value={ty()}
        onInput={e => setTy(e.currentTarget.valueAsNumber)}
        onChange={handle}
      />
    </InputGroup>
    <InputGroup>
      <InputLeftAddon>水平缩放</InputLeftAddon>
      <Input type="range" min={0.1} max={10}
        step={0.1}
        value={sx()}
        onInput={e => setSx(e.currentTarget.valueAsNumber)}
        onChange={handle}
      />
    </InputGroup>
    <InputGroup>
      <InputLeftAddon>垂直缩放</InputLeftAddon>
      <Input type="range" min={0.1} max={10}
        step={0.1}
        value={sy()}
        onInput={e => setSy(e.currentTarget.valueAsNumber)}
        onChange={handle}
      />
    </InputGroup>
    <InputGroup>
      <InputLeftAddon>旋转</InputLeftAddon>
      <Input type="range" min={0} max={180}
        value={rotation()}
        onInput={e => setRotation(e.currentTarget.valueAsNumber)}
        onChange={handle}
      />
    </InputGroup>
    <div class={style.images}>
      <ImagePreview
        title="原图"
        image={img()}
      />
      {dft() && <>
        <ImagePreview title="频谱" image={dftSpectrum(dft()!)} />
        <ImagePreview title="对数变换后的频谱" image={dftSpectrum(dft()!, true)} />
        <ImagePreview title="相角" image={phaseAngle(dft()!)} />

      </>}
    </div>
  </div>
}
