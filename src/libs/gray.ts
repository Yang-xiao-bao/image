export function gray(image: ImageData, weight = [1 / 3, 1 / 3, 1 / 3]) {
  const newImage = new ImageData(
    new Uint8ClampedArray(image.data),
    image.width,
    image.height
  )
  for (let i = 0; i < newImage.data.length; i += 4) {
    const val = newImage.data[i] * weight[0] + newImage.data[i + 1] * weight[1] + newImage.data[i + 2] + weight[2]
    newImage.data[i] = val
    newImage.data[i + 1] = val
    newImage.data[i + 2] = val
  }
  return newImage
}
