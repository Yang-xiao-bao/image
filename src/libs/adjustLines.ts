export function adjustLines(img: ImageData, points: Array<[number, number]>) {
  points = points.map(([x, y]) => [Math.round(x * 255), Math.round(y * 255)])

  const result = new ImageData(img.width, img.height);
  const linearFuncs: Array<
    {
      i: [number, number]
      f: (v: number) => number,
    }
  > = []
  const indensityMap: Array<number> = []
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    linearFuncs.push({
      i: [a[0], b[0]],
      f: linear([a[0], b[0]], [a[1], b[1]]),
    })
  }
  for (let i = 0; i < 256; i++) {
    const func = linearFuncs.find(({ i: [a, b] }) => i >= a && i <= b)
    if (func) {
      indensityMap[i] = func.f(i)
    } else {
      indensityMap[i] = i
    }
  }


  for (let i = 0; i < result.data.length; i += 4) {
    result.data[i] = indensityMap[img.data[i]]
    result.data[i + 1] = indensityMap[img.data[i + 1]]
    result.data[i + 2] = indensityMap[img.data[i + 2]]
    result.data[i + 3] = img.data[i + 3];
  }
  return result
}

function linear(input: [number, number], output: [number, number]) {
  const inputLen = input[1] - input[0]
  const outputLen = output[1] - output[0]
  return (v: number) => {
    // (v - input[0])/inputLen = (V-output[0])/outputLen
    return output[0] + (v - input[0]) * outputLen / inputLen
  }
}
