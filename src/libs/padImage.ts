import { FloatImageData } from "./image";

export type PaddingStrategy = 'zero' | 'replicate'
export function padImage<T extends FloatImageData | ImageData>(img: T,
  kernelWidth: number,
  kernelHeight: number,
  padding: PaddingStrategy = 'zero'
): T {
  const cx = Math.floor(kernelWidth / 2);
  const cy = Math.floor(kernelHeight / 2);
  const paddedWidth = img.width + kernelWidth - 1;
  const paddedHeight = img.height + kernelHeight - 1;
  const padded: ImageData | FloatImageData =
    img instanceof ImageData
      ? new ImageData(paddedWidth, paddedHeight)
      : { width: paddedWidth, height: paddedHeight, data: new Float32Array(paddedWidth * paddedHeight * 4) }
  for (let row = 0; row < paddedHeight; row++) {
    const y = row - cx
    for (let col = 0; col < paddedWidth; col++) {
      const x = col - cy
      if (x >= 0 && x < img.width) {
        if (y >= 0 && y < img.height) {
          padded.data[(row * padded.width + col) * 4] =
            img.data[(y * img.width + x) * 4]
          padded.data[(row * padded.width + col) * 4 + 1] =
            img.data[(y * img.width + x) * 4 + 1]
          padded.data[(row * padded.width + col) * 4 + 2] =
            img.data[(y * img.width + x) * 4 + 2]
          padded.data[(row * padded.width + col) * 4 + 3] = 255
        } else if (y < 0) {
          padded.data[(row * padded.width + col) * 4] =
            padding === 'zero'
              ? 0
              : img.data[(0 * img.width + x) * 4]
          padded.data[(row * padded.width + col) * 4 + 1] =
            padding === 'zero'
              ? 0
              : img.data[(0 * img.width + x) * 4 + 1]
          padded.data[(row * padded.width + col) * 4 + 2] =
            padding === 'zero'
              ? 0
              : img.data[(0 * img.width + x) * 4 + 2]
          padded.data[(row * padded.width + col) * 4 + 3] = 255
        } else if (y >= img.height) {
          padded.data[(row * padded.width + col) * 4] =
            padding === 'zero'
              ? 0
              : img.data[((img.height - 1) * img.width + x) * 4]
          padded.data[(row * padded.width + col) * 4 + 1] =
            padding === 'zero'
              ? 0
              : img.data[((img.height - 1) * img.width + x) * 4 + 1]
          padded.data[(row * padded.width + col) * 4 + 2] =
            padding === 'zero'
              ? 0
              : img.data[((img.height - 1) * img.width + x) * 4 + 2]
          padded.data[(row * padded.width + col) * 4 + 3] = 255
        }
      } else if (x < 0) {
        if (y >= 0 && y < img.height) {
          padded.data[(row * padded.width + col) * 4] =
            padding === 'zero'
              ? 0
              : img.data[(y * img.width + 0) * 4]
          padded.data[(row * padded.width + col) * 4 + 1] =
            padding === 'zero'
              ? 0
              : img.data[(y * img.width + 0) * 4 + 1]
          padded.data[(row * padded.width + col) * 4 + 2] =
            padding === 'zero'
              ? 0
              : img.data[(y * img.width + 0) * 4 + 2]
          padded.data[(row * padded.width + col) * 4 + 3] = 255
        } else if (y < 0) {
          padded.data[(row * padded.width + col) * 4] =
            padding === 'zero'
              ? 0
              : img.data[(0 * img.width + 0) * 4]
          padded.data[(row * padded.width + col) * 4 + 1] =
            padding === 'zero'
              ? 0
              : img.data[(0 * img.width + 0) * 4 + 1]
          padded.data[(row * padded.width + col) * 4 + 2] =
            padding === 'zero'
              ? 0
              : img.data[(0 * img.width + 0) * 4 + 2]
          padded.data[(row * padded.width + col) * 4 + 3] = 255
        } else { // y>=img.height
          padded.data[(row * padded.width + col) * 4] =
            padding === 'zero'
              ? 0
              : img.data[((img.height - 1) * img.width + 0) * 4]
          padded.data[(row * padded.width + col) * 4 + 1] =
            padding === 'zero'
              ? 0
              : img.data[((img.height - 1) * img.width + 0) * 4 + 1]
          padded.data[(row * padded.width + col) * 4 + 2] =
            padding === 'zero'
              ? 0
              : img.data[((img.height - 1) * img.width + 0) * 4 + 2]
          padded.data[(row * padded.width + col) * 4 + 3] = 255
        }
      } else if (x >= img.width) {
        if (y >= 0 && y < img.height) {
          padded.data[(row * padded.width + col) * 4] =
            padding === 'zero'
              ? 0
              : img.data[(y * img.width + (img.width - 1)) * 4]
          padded.data[(row * padded.width + col) * 4 + 1] =
            padding === 'zero'
              ? 0
              : img.data[(y * img.width + (img.width - 1)) * 4 + 1]
          padded.data[(row * padded.width + col) * 4 + 2] =
            padding === 'zero'
              ? 0
              : img.data[(y * img.width + (img.width - 1)) * 4 + 2]
          padded.data[(row * padded.width + col) * 4 + 3] = 255
        } else if (y < 0) {
          padded.data[(row * padded.width + col) * 4] =
            padding === 'zero'
              ? 0
              : img.data[(0 * img.width + (img.width - 1)) * 4]
          padded.data[(row * padded.width + col) * 4 + 1] =
            padding === 'zero'
              ? 0
              : img.data[(0 * img.width + (img.width - 1)) * 4 + 1]
          padded.data[(row * padded.width + col) * 4 + 2] =
            padding === 'zero'
              ? 0
              : img.data[(0 * img.width + (img.width - 1)) * 4 + 2]
          padded.data[(row * padded.width + col) * 4 + 3] = 255
        } else { // y>=img.height
          padded.data[(row * padded.width + col) * 4] =
            padding === 'zero'
              ? 0
              : img.data[((img.height - 1) * img.width + (img.width - 1)) * 4]
          padded.data[(row * padded.width + col) * 4 + 1] =
            padding === 'zero'
              ? 0
              : img.data[((img.height - 1) * img.width + (img.width - 1)) * 4 + 1]
          padded.data[(row * padded.width + col) * 4 + 2] =
            padding === 'zero'
              ? 0
              : img.data[((img.height - 1) * img.width + (img.width - 1)) * 4 + 2]
          padded.data[(row * padded.width + col) * 4 + 3] = 255
        }
      }
    }
  }
  return padded
}
