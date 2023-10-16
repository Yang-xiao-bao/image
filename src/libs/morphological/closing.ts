import { BinaryImageData } from "../image";
import { StructureElements } from "./se";
import { erode } from './erode';
import { dilate } from './dilation'
export function closing(img: BinaryImageData, se: StructureElements) {
  const r = dilate(img, se)
  return erode(r, se)
}
