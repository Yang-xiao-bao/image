const tag = Symbol('Matrix')
export type Matrix = {
  [tag]: true
  get: () => number[][]
  scale: (b: number) => Matrix
  dotMul: (b: Matrix) => Matrix
  add: (b: Matrix) => Matrix
}
function isMatrix(a: any): a is Matrix {
  return a && a[tag]
}

export function create(nums: number[][]): Matrix {
  const t: Matrix = {
    [tag]: true,
    get() {
      return nums
    },
    scale(b) {
      return create(
        t.get().map((row) => row.map((col) => col * b))
      )
    },
    add(b) {
      return add(t, b)
    },
    dotMul(b) {
      return dotMul(t, b)
    }
  }
  return t
}
function add(t: Matrix, b: Matrix) {
  if (!isMatrix(b)) {
    throw new Error('add: not matrix')
  }
  const aNums = t.get()
  const bNums = b.get()
  if (aNums.length !== bNums.length || aNums[0].length !== bNums[0].length) {
    throw new Error('add: matrix shape not match')
  }
  return create(
    aNums.map((row, i) => row.map((col, j) => col + bNums[i][j]))
  )
}

function dotMul(a: Matrix, b: Matrix) {
  const aNums = a.get()
  const bNums = b.get()
  if (aNums.length !== bNums.length || aNums[0].length !== bNums[0].length) {
    throw new Error('dotMul: matrix shape not match')
  }
  return create(
    aNums.map((row, i) => row.map((col, j) => col * bNums[i][j]))
  )
}

export function ones(w: number, h: number = w) {
  return create(new Array(h).fill(0).map(() => new Array(w).fill(1)))
}

export function diagonal(w: number, h: number) {
  return create(
    new Array(h).fill(0).map((_, i) => new Array(w).fill(0).map((_, j) => (i === j ? 1 : 0)))
  )
}
