import { Channel } from "../types/image";
import { HistType } from "./hist";
import { create } from './mat'
import { avl } from './avl'

const neighborMat = {
  4: create([
    [0, 1, 0],
    [1, 1, 1],
    [0, 1, 0]
  ])
    .scale(1 / 5)
    .get(),
  8: create([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
  ]).scale(1 / 9).get(),
  13: create([
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0]
  ]).scale(1 / 13).get(),
  21: create([
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0]
  ]).scale(1 / 21).get(),
  25: create([
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1]
  ]).scale(1 / 25).get()
}
const neighbors: Record<4 | 8 | 13 | 21 | 25, (4 | 8 | 13 | 21 | 25)[]> = {
  4: [4],
  8: [4, 8],
  13: [4, 8, 13],
  21: [4, 8, 13, 21],
  25: [4, 8, 13, 21, 25]
}

export function exactHistMatch(img: ImageData, hist: Omit<HistType, 'all'>, k: 1 | 4 | 8 | 13 | 21 | 25) {
  type Data = {
    x: number,
    y: number,
    weight: number,
  }
  const r = avl<Data>((a, b) => a.weight - b.weight)
  const g = avl<Data>((a, b) => a.weight - b.weight)
  const b = avl<Data>((a, b) => a.weight - b.weight)

  function getIndensity(x: number, y: number, c: Omit<Channel, 'all'>, k: 4 | 8 | 13 | 21 | 25) {
    const neighbor = neighborMat[k]
    const center = Math.floor(neighbor.length / 2)
    const offset = c === 'r' ? 0 : c === 'g' ? 1 : 2
    let sum = 0
    for (let ny = 0; ny < neighbor.length; ny++) {
      for (let nx = 0; nx < neighbor[ny].length; nx++) {
        const px = x + nx - center
        const py = y + ny - center
        if (px >= 0 && px < img.width && py >= 0 && py < img.height) {
          const index = (py * img.width + px) * 4 + offset
          sum += img.data[index] * neighbor[ny][nx]
        }
      }
    }
    return sum
  }

  function calcIndensities(x: number, y: number, c: Omit<Channel, 'all'>) {
    const offset = c === 'r' ? 0 : c === 'g' ? 1 : 2
    const index = (y * img.width + x) * 4 + offset
    const values = [img.data[index]]
    if (k > 1) {
      // @ts-ignore
      for (let k1 of neighbors[k]) {
        values.push(
          getIndensity(x, y, c, k1)
        )
      }
    }
    return values
  }

  for (let x = 0; x < img.width; x++) {
    for (let y = 0; y < img.height; y++) {
      r.insert({
        x, y,
        weight: calcWeight(calcIndensities(x, y, 'r'))
      })
      g.insert({
        x, y,
        weight: calcWeight(calcIndensities(x, y, 'g'))
      })
      b.insert({
        x, y,
        weight: calcWeight(calcIndensities(x, y, 'b'))
      })
    }
  }
  const result = new ImageData(
    new Uint8ClampedArray(img.data),
    img.width, img.height)
  let rIndex = 0
  let gIndex = 0
  let bIndex = 0
  const rOrdering = r.get()
  const gOrdering = g.get()
  const bOrdering = b.get()
  for (let i = 0; i < 256; i++) {
    let count = hist.r[i]
    while (count-- > 0) {
      const { x, y } = rOrdering[rIndex++]
      const rInd = (y * img.width + x) * 4
      result.data[rInd] = i
    }
    count = hist.g[i]
    while (count-- > 0) {
      const { x, y } = gOrdering[gIndex++]
      const gInd = (y * img.width + x) * 4 + 1
      result.data[gInd] = i
    }
    count = hist.b[i]
    while (count-- > 0) {
      const { x, y } = bOrdering[bIndex++]
      const bInd = (y * img.width + x) * 4 + 2
      result.data[bInd] = i
    }
  }
  return result
}
type Ordering = {
  x: number,
  y: number,
  weight: number,
}
function ordering() {
  type Node = {
    weight: number,
    height: number
    value: { weight: number, x: number, y: number }
    dups: { x: number, y: number }[]
    left?: Node
    right?: Node
  }
  let root: Node | undefined
  function height(node: Node | undefined) {
    return node?.height ?? 0
  }
  function create(value: Ordering, left?: Node, right?: Node): Node {
    return {
      height: Math.max(height(left), height(right)) + 1,
      weight: value.weight,
      left,
      right,
      dups: [],
      value
    }
  }
  function createByNode(value: Node, left?: Node, right?: Node) {
    const n = create(value.value, left, right)
    n.dups = value.dups
    return n
  }
  function add(x: Ordering, tree?: Node): Node {
    if (tree == null) {
      return create(x)
    }
    if (tree.weight === x.weight) {
      tree.dups.push(x)
      return tree
    } else if (x.weight < tree.weight) {
      return bal(tree, add(x, tree.left), tree.right)
    } else {
      return bal(tree, tree.left, add(x, tree.right))
    }
  }
  function bal(node: Node, left?: Node, right?: Node) {
    const hl = height(left)
    const hr = height(right)
    if (hl > hr + 2) {
      if (left && height(left.left) >= height(left.right)) {
        return createByNode(left, left.left, createByNode(node, left.right, right))
      }
      if (left && left.right) {
        return createByNode(left.right,
          createByNode(left, left.left, left.right.left),
          createByNode(node, left.right.right, right))
      }
      throw new Error('unreachable')
    } else if (hr > hl + 2) {
      if (right && height(right.right) >= height(right.left)) {
        return createByNode(right,
          createByNode(node, left, right.left), right.right)
      }
      if (right && right.left) {
        return createByNode(right.left,
          createByNode(node, left, right.left.left),
          createByNode(right, right.left.right, right.right))
      }
      throw new Error('unreachable')
    }
    return createByNode(node, left, right)
  }


  function insert(o: Ordering) {
    root = add(o, root)
  }

  function collect(node: Node, result: { x: number, y: number }[]) {
    if (node.left !== undefined) {
      collect(node.left, result)
    }
    result.push(node.value)
    for (let n of node.dups) {
      result.push(n)
    }
    if (node.right !== undefined) {
      collect(node.right, result)
    }
  }


  return {
    insert,
    getr: () => root,
    get: () => {
      const ordering: { x: number, y: number }[] = []
      if (root !== undefined) {
        collect(root, ordering)
      }
      return ordering
    }
  }
}
// 一组像素灰度
function calcWeight(values: number[]) {
  /**
   * weigh t = v[0] + v[1] * 2^8 + v[1] * 2^9 ...
   * */
  let weight = values[0]
  let i = 7
  for (let j = 1; j < values.length; j++) {
    weight = weight + values[j] * 2 ** (j + i)
  }
  return weight
}
