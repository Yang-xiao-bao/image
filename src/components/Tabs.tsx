import { For } from 'solid-js'
import style from './Tabs.module.css'
export type TabsProps = {
  class?: string
  tabs: string[]
  selected: string
  onChange: (name: string) => void
}
export function Tabs(props: TabsProps) {
  return <ul class={props.class + ' ' + style.container}>
    <For each={props.tabs}>
      {(name) => <li class={`${style.item} ${props.selected === name ? 'selected' : ''}`}
        onClick={() => { props.onChange(name) }}>{name}</li>}
    </For>
  </ul>
}
