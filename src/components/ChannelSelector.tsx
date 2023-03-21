import {
  Select,
  SelectTrigger,
  SelectPlaceholder,
  SelectValue,
  SelectIcon,
  SelectContent,
  SelectListbox,
  SelectOption,
  SelectOptionText,
  SelectOptionIndicator,
  InputGroup,
  InputLeftAddon
} from "@hope-ui/solid"
import { For } from "solid-js/web"
import { Channel } from "../types/image"

export type ChannelSelectorProps = {
  value: Channel
  onChange: (value: Channel) => void
}
export function ChannelSelector(props: ChannelSelectorProps) {
  const channels: Array<{ channel: Channel, name: string }> = [
    { channel: 'all', name: "All" },
    { channel: 'r', name: "Red" },
    { channel: 'g', name: "Green" },
    { channel: 'b', name: "Blue" },
  ]
  return <InputGroup>
    <InputLeftAddon>
      选择通道
    </InputLeftAddon>
    <Select value={props.value} onChange={props.onChange}>
      <SelectTrigger>
        <SelectValue />
        <SelectIcon />
      </SelectTrigger>
      <SelectContent>
        <SelectListbox>
          <For each={channels}>
            {item => (
              <SelectOption value={item.channel}>
                <SelectOptionText>{item.name}</SelectOptionText>
                <SelectOptionIndicator />
              </SelectOption>
            )}
          </For>
        </SelectListbox>
      </SelectContent>
    </Select>
  </InputGroup>
}
