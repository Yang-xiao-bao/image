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

export function pow(a: FloatImageData | ImageData, p: number) {
  const r: FloatImageData = {
    width: a.width,
    height: a.height,
    data: new Float32Array(a.data.length),
    hit: 'remap'
  }
  for (let i = 0; i < a.data.length; i += 4) {
    r.data[i] = (a.data[i] ** p)
    r.data[i + 1] = (a.data[i + 1] ** p)
    r.data[i + 2] = (a.data[i + 2] ** p)
    r.data[i + 3] = 255
  }
  return r

}

export function abs(a: FloatImageData) {

  const r: FloatImageData = {
    width: a.width,
    height: a.height,
    data: new Float32Array(a.data.length),
    hit: 'remap'
  }
  for (let i = 0; i < a.data.length; i += 4) {
    r.data[i] = Math.abs(a.data[i])
    r.data[i + 1] = Math.abs(a.data[i + 1])
    r.data[i + 2] = Math.abs(a.data[i + 2])
    r.data[i + 3] = 255
  }
  return r
}
export function add(
  a: FloatImageData | ImageData, b: FloatImageData | ImageData) {
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
    r.data[i] = (a.data[i] + (b.data[i]))
    r.data[i + 1] = (a.data[i + 1] + (b.data[i + 1]))
    r.data[i + 2] = (a.data[i + 2] + (b.data[i + 2]))
    r.data[i + 3] = 255
  }
  return r
}

export function scale(a: FloatImageData | ImageData, s: number) {
  const r: FloatImageData = {
    width: a.width,
    height: a.height,
    data: new Float32Array(a.data.length),
    hit: 'remap'
  }
  for (let i = 0; i < a.data.length; i += 4) {
    r.data[i] = (a.data[i] * s)
    r.data[i + 1] = (a.data[i + 1] * s)
    r.data[i + 2] = (a.data[i + 2] * s)
    r.data[i + 3] = 255
  }
  return r
}

export function sub(
  a: FloatImageData | ImageData, b: FloatImageData | ImageData) {
  if (a.width !== b.width || a.height !== b.height) {
    throw new Error("Image size mismatch")
  }
  return add(
    a,
    scale(b, -1)
  )
}
