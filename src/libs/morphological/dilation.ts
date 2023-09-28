import { BinaryImageData } from "../image"
import { StructureElements } from "./se"

export function dilate(img: BinaryImageData, se: StructureElements) {
  const r: BinaryImageData = {
    width: img.width,
    height: img.height,
    data: new Uint8Array(img.data.length)
  }
  for (let x = se.ox; x < (img.width - (se.width - se.ox)); x++) {
    for (let y = se.oy; y < (img.height - (se.height - se.oy)); y++) {
      let overlay = false
      // 结构元是否与图像相交
      for (let s = 0; s < se.width; s++) {
        for (let t = 0; t < se.height; t++) {
          if (se.data[s + t * se.width] === 1 &&
            img.data[(x + s) + (y + t) * img.width] === 1
          ) {
            overlay = true
            break
          }
        }
      }
      if(overlay) {
        r.data[x + y * r.width] = 1
      }
    }
  }
  return r
}
