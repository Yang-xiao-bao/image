export type Control = 'continue' | 'halt'
export function* asyncConvolve(
  img: ImageData,
  kernel: number[][]) {

  let counter = 0
  const result = new ImageData(img.width, img.height);
  const kernelWidth = kernel[0].length;
  const kernelHeight = kernel.length;
  const size = img.width * img.height //(img.width + (kernelWidth-1)) * (img.height + (kernelHeight-1))
  const STEP = ~~(size * 0.01)
  const cx = Math.floor(kernelWidth / 2);
  const cy = Math.floor(kernelHeight / 2);

  // center
  //let maxX = img.width-1 - Math.ceil(kernelWidth/2)+1
  let centerMaxX = img.width - Math.ceil(kernelWidth / 2)
  let centerMaxY = img.height - Math.ceil(kernelHeight / 2)
  for (let x = cx; x <= centerMaxX; x++) {
    for (let y = cy; y <= centerMaxY; y++) {
      let r = 0;
      let g = 0;
      let b = 0;

      for (let kx = 0; kx < kernelWidth; kx++) {
        for (let ky = 0; ky < kernelHeight; ky++) {
          // cx,cy 与 x y 对齐
          const px = x + kx - cx
          const py = y + ky - cy
          const ind = (py * img.width + px) * 4
          const k = kernel[kernelHeight - ky - 1][kernelWidth - kx - 1]
          r += img.data[ind + 0] * k
          g += img.data[ind + 1] * k
          b += img.data[ind + 2] * k
        }
      }
      const ind = (y * img.width + x) * 4
      result.data[ind + 0] = r;
      result.data[ind + 1] = g;
      result.data[ind + 2] = b;
      result.data[ind + 3] = 255;
      if (++counter % STEP === 0) {
        const control: Control = yield (counter / size)
        if (control === 'halt') return
      }
    }
  }
  //top
  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < cy; y++) {
      let r = 0;
      let g = 0;
      let b = 0;

      for (let kx = 0; kx < kernelWidth; kx++) {
        for (let ky = 0; ky < kernelHeight; ky++) {
          // cx,cy 与 x y 对齐
          const px = x + kx - cx
          const py = y + ky - cy
          const ind = (py * img.width + px) * 4
          const k = kernel[kernelHeight - ky - 1][kernelWidth - kx - 1]
          if (px < 0 || px >= img.width || py < 0 || py >= img.height) {
            continue
          }
          r += img.data[ind + 0] * k
          g += img.data[ind + 1] * k
          b += img.data[ind + 2] * k
        }
      }
      const ind = (y * img.width + x) * 4
      result.data[ind + 0] = r;
      result.data[ind + 1] = g;
      result.data[ind + 2] = b;
      result.data[ind + 3] = 255;
      if (++counter % STEP === 0) {
        const control: Control = yield (counter / size)
        if (control === 'halt') return
      }
    }
  }
  // bottom
  let yStart = img.height - (Math.ceil(kernelHeight / 2) - 1)
  for (let x = 0; x < img.width; x++) {
    for (let y = yStart; y < img.height; y++) {
      let r = 0;
      let g = 0;
      let b = 0;

      for (let kx = 0; kx < kernelWidth; kx++) {
        for (let ky = 0; ky < kernelHeight; ky++) {
          // cx,cy 与 x y 对齐
          const px = x + kx - cx
          const py = y + ky - cy
          const ind = (py * img.width + px) * 4
          const k = kernel[kernelHeight - ky - 1][kernelWidth - kx - 1]
          if (px < 0 || px >= img.width || py < 0 || py >= img.height) {
            continue
          }
          r += img.data[ind + 0] * k
          g += img.data[ind + 1] * k
          b += img.data[ind + 2] * k
        }
      }
      const ind = (y * img.width + x) * 4
      result.data[ind + 0] = r;
      result.data[ind + 1] = g;
      result.data[ind + 2] = b;
      result.data[ind + 3] = 255;
      if (++counter % STEP === 0) {
        const control: Control = yield (counter / size)
        if (control === 'halt') return
      }
    }
  }
  // left
  for (let x = 0; x < cx; x++) {
    for (let y = cy; y < yStart; y++) {
      let r = 0;
      let g = 0;
      let b = 0;

      for (let kx = 0; kx < kernelWidth; kx++) {
        for (let ky = 0; ky < kernelHeight; ky++) {
          // cx,cy 与 x y 对齐
          const px = x + kx - cx
          const py = y + ky - cy
          const ind = (py * img.width + px) * 4
          const k = kernel[kernelHeight - ky - 1][kernelWidth - kx - 1]
          if (px < 0) {
            continue
          }
          r += img.data[ind + 0] * k
          g += img.data[ind + 1] * k
          b += img.data[ind + 2] * k
        }
      }
      const ind = (y * img.width + x) * 4
      result.data[ind + 0] = r;
      result.data[ind + 1] = g;
      result.data[ind + 2] = b;
      result.data[ind + 3] = 255;
      if (++counter % STEP === 0) {
        const control: Control = yield (counter / size)
        if (control === 'halt') return
      }

    }
  }
  // right
  for (let x = centerMaxX + 1; x < img.width; x++) {
    for (let y = cy; y < yStart; y++) {
      let r = 0;
      let g = 0;
      let b = 0;

      for (let kx = 0; kx < kernelWidth; kx++) {
        for (let ky = 0; ky < kernelHeight; ky++) {
          // cx,cy 与 x y 对齐
          const px = x + kx - cx
          const py = y + ky - cy
          const ind = (py * img.width + px) * 4
          const k = kernel[kernelHeight - ky - 1][kernelWidth - kx - 1]
          if (px >= img.width) {
            continue
          }
          r += img.data[ind + 0] * k
          g += img.data[ind + 1] * k
          b += img.data[ind + 2] * k
        }
      }
      const ind = (y * img.width + x) * 4
      result.data[ind + 0] = r;
      result.data[ind + 1] = g;
      result.data[ind + 2] = b;
      result.data[ind + 3] = 255;
      if (++counter % STEP === 0) {
        const control: Control = yield (counter / size)
        if (control === 'halt') return
      }
    }
  }
  yield 1
  return result
}

export type AsyncConvolveRunner = {
  start(onProgress?: (progress: number) => void): Promise<ImageData | null>
  stop(): void
}
export function run(img: ImageData, kernel: number[][]): AsyncConvolveRunner {
  let stopSignal = false
  let timer = -1
  return {
    start(onProgress?: (progress: number) => void) {
      stopSignal = false
      const generator = asyncConvolve(img, kernel)
      return new Promise<ImageData | null>((resolve, reject) => {
        const schedule = () => {
          timer = setTimeout(() => {
            const { value, done } = generator.next(stopSignal ? 'halt' : 'continue')
            if (!done) {
              onProgress?.(value)
              schedule()
            } else {
              if (value) {
                resolve(value)
              } else {
                resolve(null)
              }
            }
          })
        }
        schedule()
      })
    },
    stop() {
      stopSignal = true
      clearTimeout(timer)
    }
  }
}
