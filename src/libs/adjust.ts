import { clamp } from "../utils/clamp"

export function adjust(img: ImageData,
  /**
* Range: [0 1]
* */
  input: [number, number],
  /**
* Range [0 1]
* */
  out: [number, number], gamma: number) {
  if (input[0] > input[1]) {
    throw new Error("input[0] must be less than input[1]")
  }

  const result = new ImageData(
    new Uint8ClampedArray(img.data),
    img.width,
    img.height
  )
  let [ia, ib] = input
  let [oa, ob] = out
  ia = ia * 255
  ib = ib * 255
  oa = oa * 255
  ob = ob * 255
  const di = ib - ia;
  const dO = ob - oa;
  for (let i = 0; i < img.data.length; i++) {
    const r = clamp(img.data[i], ia, ib)
    const g = clamp(img.data[i + 1], ia, ib)
    const b = clamp(img.data[i + 2], ia, ib)
    result.data[i] = oa + (((r - ia) / di) ** gamma) * dO
    result.data[i + 1] = oa + (((g - ia) / di) ** gamma) * dO
    result.data[i + 2] = oa + (((b - ia) / di) ** gamma) * dO
  }
  return result
}
