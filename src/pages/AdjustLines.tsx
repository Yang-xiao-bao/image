import { createSignal } from "solid-js";
import { LineEditor } from "../components/LineEditor";

export function AdjustLines() {
  const [points, setPoints] = createSignal<[number, number][]>([
    [0, 0],
    [0.4, 0.05],
    [0.8, 0.95],
    [1, 1]]);
  return <div>
    <LineEditor points={points()} onChange={setPoints} />
  </div>
}
