import { GrayImageData } from "./image";

export function butterworthNothReject(
  width: number,
  height: number,
  points: Array<[number, number]>,
  d: number,
  n: number,
) {
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
      //const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
      let val = 1;
      for (const [u, v] of points) {
        const dk = Math.sqrt((x - cx - u) ** 2 + (y - cy - v) ** 2)
        const dk2 = Math.sqrt((x - cx + u) ** 2 + (y - cy + v) ** 2)
        val = val * (1 / (1 + (d / dk) ** n)) * (1 / (1 + (d / dk2) ** n))
      }
      filter.data[y * width + x] = val
    }
  }
  return filter
}
