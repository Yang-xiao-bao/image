import { For } from 'solid-js'
import style from './TreeView.module.css'

export type TreeViewData<T> = {
  name: string;
  value: T
  children?: TreeViewData<T>[];
}
export type TreeViewProps<T> = {
  data: TreeViewData<T>[];
  onLeafClick?: (item: TreeViewData<T>) => void;
}

export function TreeView<T>(props: TreeViewProps<T>) {
  return <For each={props.data}>
    {
      (item) => {
        const isLeaf = item.children?.length == 0
        return <div>
          {isLeaf ?
            <button class={style.node} onClick={() => props.onLeafClick?.(item)}>{item.name}</button>
            :
            <div onClick={() => props.onLeafClick?.(item)}>{item.name}</div>
          }
          {!isLeaf &&
            <div class={style.subTree}>
              <TreeView data={item.children!} onLeafClick={props.onLeafClick} />
            </div>
          }
        </div>
      }
    }
  </For>
}
