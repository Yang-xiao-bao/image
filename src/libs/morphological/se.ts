import { ones } from "../mat"

export type StructureElements = {
  width: number,
  height: number,
  ox: number,
  oy: number,
  data: Uint8Array
}

export function square(size:number):StructureElements {
  const ox = size / 2 | 0
  const oy = ox
  return {
    width:size,
    height:size,
    ox,oy,
    data: new Uint8Array(ones(size,size).get().flat())
  }
}
