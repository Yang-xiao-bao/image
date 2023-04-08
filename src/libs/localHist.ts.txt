import { statistics } from './statistics'
export function localHistAdjust(image: ImageData,
  // 领域大小
  n: number,
  c: number,
  meanFactors: [number, number],
  varFactors: [number, number]
) {
  const globalStatistics = statistics(image)
  const r = new ImageData(
    new Uint8ClampedArray(image.data),
    image.width,
    image.height
  )
  const minGlobalMeanR = globalStatistics.mean.r * meanFactors[0]
  const maxGlobalMeanR = globalStatistics.mean.r * meanFactors[1]
  const minGlobalMeanG = globalStatistics.mean.g * meanFactors[0]
  const maxGlobalMeanG = globalStatistics.mean.g * meanFactors[1]
  const minGlobalMeanB = globalStatistics.mean.b * meanFactors[0]
  const maxGlobalMeanB = globalStatistics.mean.b * meanFactors[1]

  const minGlobalVarR = Math.sqrt(globalStatistics.variance.r * varFactors[0])
  const maxGlobalVarR = Math.sqrt(globalStatistics.variance.r * varFactors[1])
  const minGlobalVarG = Math.sqrt(globalStatistics.variance.g * varFactors[0])
  const maxGlobalVarG = Math.sqrt(globalStatistics.variance.g * varFactors[1])
  const minGlobalVarB = Math.sqrt(globalStatistics.variance.b * varFactors[0])
  const maxGlobalVarB = Math.sqrt(globalStatistics.variance.b * varFactors[1])

  for (let x = 0; x < image.width; x++) {
    for (let y = 0; y < image.height; y++) {
      const ls = localStatistics(image, x, y, n / 2 | 0)
      const i = (y * image.width + x) * 4
      // 提亮（或减暗，取决于C>1 还是C<1) 局部均值以及标准差在指定范围的像素
      if ((ls.std.r >= minGlobalVarR && ls.std.r <= maxGlobalVarR) &&
        (ls.mean.r >= minGlobalMeanR && ls.mean.r <= maxGlobalMeanR)
      ) {
        r.data[i] = image.data[i] * c
      }
      if ((ls.std.g >= minGlobalVarG && ls.std.g <= maxGlobalVarG) &&
        (ls.mean.g >= minGlobalMeanG && ls.mean.g <= maxGlobalMeanG)
      ) {
        r.data[i + 1] = image.data[i + 1] * c
      }
      if ((ls.std.b >= minGlobalVarB && ls.std.b <= maxGlobalVarB) &&
        (ls.mean.b >= minGlobalMeanB && ls.mean.b <= maxGlobalMeanB)
      ) {
        r.data[i + 2] = image.data[i + 2] * c
      }
    }
  }
  return r
}
function localStatistics(image: ImageData, x: number, y: number, n: number) {
  const ns = neighbors(x, y, n, image)
  const rgbs = ns.map(([x, y]) => {
    const i = (y * image.width + x) * 4
    return [image.data[i], image.data[i + 1], image.data[i + 2]]
  })
  const mean = rgbs.reduce((a, b) => {
    a.r += b[0]
    a.g += b[1]
    a.b += b[2]
    return a
  }, { r: 0, g: 0, b: 0 })
  mean.r /= rgbs.length
  mean.g /= rgbs.length
  mean.b /= rgbs.length

  const std = rgbs.reduce((a, b) => {
    a.r += (b[0] - mean.r) ** 2
    a.g += (b[1] - mean.g) ** 2
    a.b += (b[2] - mean.b) ** 2
    return a
  }, { r: 0, g: 0, b: 0 })
  std.r = Math.sqrt(std.r / (rgbs.length - 1))
  std.g = Math.sqrt(std.g / (rgbs.length - 1)) 
  std.b = Math.sqrt(std.b / (rgbs.length - 1))

  return { mean, std }
}

function neighbors(x: number, y: number, n: number, image: ImageData) {
  const r = []
  for (let i = -n; i <= n; i++) {
    for (let j = -n; j <= n; j++) {
      const x1 = x + i
      const y1 = y + j
      if (x1 >= 0 && x1 < image.width && y1 >= 0 && y1 < image.height) {
        r.push([x1, y1])
      }
    }
  }
  return r
}
