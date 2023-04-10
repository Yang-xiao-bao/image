export function convolve(
  img: ImageData,
  /**
* [
*  [0, 1, 0],
*  [1, 1, 1],
*  [0, 1, 0]
* ]
* */
  kernel: number[][],
) {
  const result = new ImageData(img.width, img.height);
  const kernelWidth = kernel[0].length;
  const kernelHeight = kernel.length;
  const cx = Math.floor(kernelWidth / 2);
  const cy = Math.floor(kernelHeight / 2);

  // center
  for (let x = cx; x < img.width - cx; x++) {
    for (let y = cy; y < img.height - cy; y++) {
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
    }
  }
  // bottom
  for (let x = 0; x < img.width; x++) {
    for (let y = img.height - cy; y < img.height; y++) {
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
    }
  }
  // left
  for (let x = 0; x < cx; x++) {
    for (let y = cy; y < img.height - cy; y++) {
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

    }
  }
  // right
  for (let x = img.width - cx; x < img.width; x++) {
    for (let y = cy; y < img.height - cy; y++) {
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

    }
  }


  return result
}
