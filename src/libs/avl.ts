export type Node<T> = {
  value: T
  dups: T[]
  left?: Node<T>
  right?: Node<T>
  height: number
}

export function avl<T>(cmp: (a: T, b: T) => number) {
  let root: Node<T> | undefined

  function height(node?: Node<T>) {
    return node != null ? node?.height : 0
  }
  function updateHeight(node: Node<T>) {
    if (node.left == null && node.right == null) {
      node.height = 0
      return
    }
    node.height = Math.max(
      height(node.left),
      height(node.right)
    ) + 1
  }

  function insert(value: T, node?: Node<T>) {
    if (node == null) {
      return { value, height: 0, dups: [] }
    }
    const c = cmp(value, node.value)
    if (c < 0) {
      // value < node.value
      node.left = insert(value, node.left)
    }
    else if (c > 0) {
      node.right = insert(value, node.right)
    } else {
      node.dups.push(value)
      return node
    }
    updateHeight(node)
    return rotate(node)
  }
  function rotate(node: Node<T>) {
    const hl = height(node.left)
    const hr = height(node.right)
    if (hl > hr + 1) {
      const ll = height(node.left?.left)
      const lr = height(node.left?.right)
      if (ll >= lr) {
        return rightRotate(node)
      }
      else {
        node.left = leftRotate(node.left!)
        return rightRotate(node)
      }
    } else if (hr > hl + 1) {
      const rl = height(node.right?.left)
      const rr = height(node.right?.right)
      if (rr >= rl) {
        return leftRotate(node)
      }
      else {
        node.right = rightRotate(node.right!)
        return leftRotate(node)
      }
    }
    return node
  }
  function rightRotate(node: Node<T>) {
    const { left } = node
    if (left == null) return node
    const lr = left.right
    left.right = node
    node.left = lr
    updateHeight(node)
    updateHeight(left)
    return left
  }
  function leftRotate(node: Node<T>) {
    const { right } = node
    if (right == null) return node
    const rl = right.left
    right.left = node
    node.right = rl
    updateHeight(node)
    updateHeight(right)
    return right
  }
  function collect(a: T[], node?: Node<T>) {
    if (node) {
      collect(a, node.left)
      a.push(node.value)
      for(let n of node.dups) {
        a.push(n)
      }
      collect(a, node.right)
    }
  }

  return {
    insert: (value: T) => {
      root = insert(value, root)
    },
    get: () => {
      const a: T[] = []
      collect(a, root)
      return a
    }
  }
}


