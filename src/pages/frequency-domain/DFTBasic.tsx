import { Input, InputGroup, InputLeftAddon, Progress, ProgressIndicator } from "@hope-ui/solid";
import { createMemo, createSignal } from "solid-js";
import { ImagePreview } from "../../components/ImagePreview";
import { SurfaceViewer } from "../../components/SurfaceViewer";
import { DFT, DFTData } from "../../libs/dft";
import { createSample } from "../../libs/dftSample";
import { dftSpectrum } from "../../libs/dftSpectrum";
import { phaseAngle } from "../../libs/phaseAngle";

export function DFTBasic() {
  const size = 70
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
    setDft(DFT(img(), shift()))
  }
  handle()
  const mag = createMemo(() => {
    const dftData = dft()
    if (dftData) {
      return dftSpectrum(dftData, false)
    }
  })


  return <div>
    <div>观察平移、旋转、形状对傅里叶频谱/相角的影响</div>
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
    <ImagePreview
      image={img()}
    />
    {dft() && <>
      <ImagePreview title="频谱" image={dftSpectrum(dft()!)} />
      <ImagePreview title="对数变换后的频谱" image={dftSpectrum(dft()!, true)} />
      <ImagePreview title="相角" image={phaseAngle(dft()!)} />
      <SurfaceViewer
        x={[0, size]}
        y={[0, size]}
        steps={[1, 1]}
        z={(x, y) => {
          return mag()!.data[y * size + x]
        }}
      />

    </>}
  </div>
}
