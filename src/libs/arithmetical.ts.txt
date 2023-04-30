import { FloatImageData } from "./image";

export function div(
  a: FloatImageData | ImageData, b: FloatImageData | ImageData,
  delta: number = 1
): FloatImageData {
  if (a.width !== b.width || a.height !== b.height) {
    throw new Error("Image size mismatch")
  }
  const r: FloatImageData = {
    width: a.width,
    height: b.height,
    data: new Float32Array(a.data.length),
    hit: 'remap'
  }
  for (let i = 0; i < a.data.length; i += 4) {
    r.data[i] = (a.data[i] / (b.data[i] + delta))
    r.data[i + 1] = (a.data[i + 1] / (b.data[i + 1] + delta))
    r.data[i + 2] = (a.data[i + 2] / (b.data[i + 2] + delta))
    r.data[i + 3] = 255
  }
  return r
}
