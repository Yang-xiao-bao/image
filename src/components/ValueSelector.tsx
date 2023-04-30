import { InputGroup, InputLeftAddon, Select, SelectContent, SelectIcon, SelectListbox, SelectOption, SelectOptionIndicator, SelectOptionText, SelectTrigger, SelectValue } from "@hope-ui/solid"
import { For } from "solid-js"

export type ValueSelectorProps<T> = {
  items: Array<{ value: T, label: string }>
  value: T,
  onChange: (val: T) => void
  label: string,
}
export function ValueSelector<T>(props: ValueSelectorProps<T>) {
  return <InputGroup>
    <InputLeftAddon>
      {props.label}
    </InputLeftAddon>
    <Select
      value={
        props.items.find(i => i.value === props.value)!.label
      }
      onChange={e => {
        props.onChange(
          props.items.find(i => i.label === e)!.value
        )
      }}
    >
      <SelectTrigger>
        <SelectValue />
        <SelectIcon />
      </SelectTrigger>
      <SelectContent>
        <SelectListbox>
          <For each={props.items}>
            {(item) => <SelectOption value={item.label}>
              <SelectOptionText>{item.label}</SelectOptionText>
              <SelectOptionIndicator />
            </SelectOption>}
          </For>
        </SelectListbox>
      </SelectContent>
    </Select>
  </InputGroup>
}
