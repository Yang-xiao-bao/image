import { BinaryImageData } from "../image";
import { StructureElements } from "./se";

export function erode(img: BinaryImageData, se: StructureElements) {
  const r: BinaryImageData = {
    width: img.width,
    height: img.height,
    data: new Uint8Array(img.data.length)
  }
  for (let x = se.ox; x < (img.width - (se.width - se.ox)); x++) {
    for (let y = se.oy; y < (img.height - (se.height - se.oy)); y++) {
      let contained = true
      for (let s = 0; s < se.width; s++) {
        for (let t = 0; t < se.height; t++) {
          if (se.data[s + t * se.width] === 1 &&
            img.data[(x - s) + (y - t) * img.width] === 0
          ) {
            contained = false
            break
          }
        }
      }
      if (contained) {
        r.data[x + y * r.width] = 1
      } else {
        r.data[x + y * r.width] = 0
      }
    }
  }
  return r
}
