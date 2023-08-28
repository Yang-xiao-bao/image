import { GrayImageData } from "./image"

export function idealBandReject(width: number, height: number, bandwidth: number, center: number): GrayImageData {
  const filter: GrayImageData = {
    width,
    height,
    data: new Float32Array(width * height),
    hit: "remap"
  }
  const cx = width / 2 | 0;
  const cy = height / 2 | 0;
  const innerRadius = center - bandwidth / 2
  const outerRadius = center + bandwidth / 2
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      if (d < innerRadius || d > outerRadius) {
        filter.data[y * width + x] = 1
      }
    }
  }
  return filter
}

export function gaussianBandReject(width: number, height: number, bandwidth: number, center: number): GrayImageData {
  const filter: GrayImageData = {
    width,
    height,
    data: new Float32Array(width * height),
    hit: "remap"
  }
  const cx = width / 2 | 0;
  const cy = height / 2 | 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      filter.data[y * width + x] = 1 - Math.exp(
        -(((d ** 2 - center ** 2) / (d * bandwidth)) ** 2)
      )
    }
  }
  return filter
}

export function butterworthBandreject(width: number, height: number, bandwidth: number, center: number, order: number = 1) {
  const filter: GrayImageData = {
    width,
    height,
    data: new Float32Array(width * height),
    hit: "remap"
  }
  const cx = width / 2 | 0;
  const cy = height / 2 | 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      filter.data[y * width + x] = 1 / (1 + ((d * bandwidth) / (d ** 2 - center ** 2)) ** (2 * order))
    }
  }
  return filter
}
