export type FloatImageData = {
  width: number,
  height: number,
  data: Float32Array,
  hit?: 'remap' | 'clamp'
}

export function toImageData(floatData: FloatImageData) {
  const hit = floatData.hit || 'clamp'
  if (hit == 'clamp') {
    return new ImageData(
      new Uint8ClampedArray(floatData.data
      ),
      floatData.width,
      floatData.height,
    )
  }
  const data = new Uint8ClampedArray(floatData.data.length)
  let rMin = floatData.data[0]
  let gMin = floatData.data[1]
  let bMin = floatData.data[2]
  let rMax = rMin
  let gMax = gMin
  let bMax = bMin

  for (let i = 0; i < data.length; i += 4) {
    rMin = Math.min(rMin, floatData.data[i])
    gMin = Math.min(gMin, floatData.data[i + 1])
    bMin = Math.min(bMin, floatData.data[i + 2])
    rMax = Math.max(rMax, floatData.data[i])
    gMax = Math.max(gMax, floatData.data[i + 1])
    bMax = Math.max(bMax, floatData.data[i + 2])
  }
  const rRange = rMax - rMin
  const gRange = gMax - gMin
  const bRange = bMax - bMin
  for (let i = 0; i < data.length; i += 4) {
    if (rRange !== 0) {
      data[i] = Math.round((floatData.data[i] - rMin) / rRange * 255)
    }
    if (gRange !== 0) {
      data[i + 1] = Math.round((floatData.data[i + 1] - gMin) / gRange * 255)
    }
    if (bRange !== 0) {
      data[i + 2] = Math.round((floatData.data[i + 2] - bMin) / bRange * 255)
    }
    data[i + 3] = 255
  }
  return new ImageData(data, floatData.width, floatData.height)
}
