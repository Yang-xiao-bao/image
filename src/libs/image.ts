
export type FloatImageData = {
  width: number,
  height: number,
  data: Float32Array,
  hit?: 'remap' | 'clamp'
}
export type GrayImageData = {
  width: number,
  height: number,
  data: Float32Array,
  hit?: 'remap' | 'clamp' | 'log-clmap' | 'log-remap'
}
export type BinaryImageData = {
  width: number,
  height: number,
  // 0 为黑色,1 为白色
  // 0 为背景，1 为前景
  data: Uint8Array
}

function grayImageData2ImageData(gray: GrayImageData) {
  const img = new ImageData(gray.width, gray.height)
  const hit = gray.hit || 'clamp'
  if (hit === 'clamp') {
    for (let i = 0, j = 0; i < img.data.length; i += 4, j++) {
      img.data[i] = gray.data[j]
      img.data[i + 1] = gray.data[j]
      img.data[i + 2] = gray.data[j]
      img.data[i + 3] = 255
    }
    return img
  } else if (hit.startsWith('log')) {
    for (let i = 0, j = 0; i < img.data.length; i += 4, j++) {
      const val = Math.sign(gray.data[j]) * Math.log(1 + Math.abs(gray.data[j]))
      img.data[i] = val
      img.data[i + 1] = val
      img.data[i + 2] = val
      img.data[i + 3] = 255
    }
    if (hit === 'log-clmap') {
      return img
    }
  }
  let min = gray.data[0]
  let max = gray.data[0]
  for (let i = 0; i < gray.data.length; i++) {
    min = Math.min(min, gray.data[i])
    max = Math.max(max, gray.data[i])
  }
  const range = max - min
  if (range === 0) {
    for (let i = 0, j = 0; i < img.data.length; i += 4, j++) {
      img.data[i] = gray.data[j]
      img.data[i + 1] = gray.data[j]
      img.data[i + 2] = gray.data[j]
      img.data[i + 3] = 255
    }
  } else {
    for (let i = 0, j = 0; i <= img.data.length; i += 4, j++) {
      const v = Math.round((gray.data[j] - min) / range * 255)
      img.data[i] = v
      img.data[i + 1] = v
      img.data[i + 2] = v
      img.data[i + 3] = 255
    }
  }
  return img
}

export function isGrayImageData(data: FloatImageData | GrayImageData | BinaryImageData): data is GrayImageData {
  return data.data instanceof Float32Array && data.data.length === data.width * data.height
}
export function isBinaryImageData(data: FloatImageData | BinaryImageData): data is BinaryImageData {
  return data.data instanceof Uint8Array
}

export function toGrayImageData(data: ImageData | FloatImageData): GrayImageData {
  const gray = new Float32Array(data.width * data.height)
  for (let i = 0, j = 0; i < data.data.length; i += 4, j++) {
    gray[j] = data.data[i]
  }
  return {
    width: data.width,
    height: data.height,
    data: gray,
    hit: 'clamp'
  }
}

function floatImageData2ImageData(floatData: FloatImageData) {
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

function binaryImageDat2ImageData(img: BinaryImageData) {
  const data = new ImageData(img.width, img.height);
  for (let i = 0; i < img.data.length; i++) {
    const j = i * 4
    if (img.data[i] === 1) {
      data.data[j] = 255
      data.data[j + 1] = 255
      data.data[j + 2] = 255
    }
    data.data[j + 3] = 255
  }
  return data
}

export function toImageData(img: FloatImageData | GrayImageData) {
  if (isGrayImageData(img)) {
    return grayImageData2ImageData(img)
  }
  if (isBinaryImageData(img)) {
    return binaryImageDat2ImageData(img)
  }
  return floatImageData2ImageData(img)
}

export function toBinaryImageData(img: ImageData) {
  const result = {
    width: img.width,
    height: img.height,
    data: new Uint8Array(img.width * img.height)
  }
  for (let i = 0; i < result.data.length; i++) {
    if (img.data[i * 4] > 128) {
      result.data[i] = 1
    }
  }
  return result
}
