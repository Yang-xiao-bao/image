export function createZonePlate(
  size: number,
  domain = 8
) {
  const img = new ImageData(size, size);
  const radius = size / 2;
  for (let col = 0; col < size; col++) {
    for (let row = 0; row < size; row++) {
      const index = (col + row * size) * 4;
      img.data[index + 3] = 255;
      if (Math.sqrt((col - radius) ** 2 + (row - radius) ** 2) > radius) continue

      const x = (col / size) * domain * 2 - domain
      const y = (row / size) * domain * 2 - domain
      const value =
        (1 + Math.cos(
          x ** 2 + y ** 2
        )) / 2 * 255
      img.data[index + 0] = value;
      img.data[index + 1] = value;
      img.data[index + 2] = value;
    }
  }
  return img
}
