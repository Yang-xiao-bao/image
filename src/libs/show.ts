import { Channel } from '../types/image'

export function show(image: ImageData, ctx: CanvasRenderingContext2D, channel: Channel) {
  if (channel == 'all') {
    ctx.putImageData(image, 0, 0)
  } else {

    const [offset1, offset2] = channel === 'r'
      ? [1, 2]
      : (channel === 'g')
        ? [0, 2]
        : [0, 1]
    const data = new ImageData(new Uint8ClampedArray(image.data), //注意要复制一下image的data
      image.width, image.height)
    for (let i = 0; i < data.data.length; i += 4) {
      data.data[i + offset1] = 0
      data.data[i + offset2] = 0
    }
    ctx.putImageData(data, 0, 0)
  }
}
