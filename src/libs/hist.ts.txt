export function hist(data: ImageData) {
  const r = new Uint32Array(256)
  const g = new Uint32Array(256)
  const b = new Uint32Array(256)
  for (let i = 0; i < data.data.length; i += 4) {
    r[data.data[i]] = r[data.data[i]] + 1
    g[data.data[i + 1]] = g[data.data[i + 1]] + 1
    b[data.data[i + 2]] = b[data.data[i + 2]] + 1
  }
  const all = new Uint32Array(256)
  for (let i = 0; i < all.length; i++) {
    all[i] = r[i] + g[i] + b[i]
  }
  return { r, g, b, all }
}
