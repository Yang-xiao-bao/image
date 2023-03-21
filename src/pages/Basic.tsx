import { createSignal } from 'solid-js'
import { ChannelSelector } from '../components/ChannelSelector'
import { ImagePreview } from '../components/ImagePreview'
import { ImageSelector } from '../components/ImageSelector'
import { Channel } from '../types/image'
import {VStack} from '@hope-ui/solid'

export function Basic() {
  const [img, setImg] = createSignal<ImageData | null>(null)
  const [channel, setChannel] = createSignal<Channel>('all')
  console.log(setChannel)
  return <VStack spacing="4px">
    <ImageSelector onSelect={setImg} />
    {img() ? <>
      <ChannelSelector value={channel()} onChange={setChannel} />
      <ImagePreview image={img()!} channel={channel()} />
    </> : null}
  </VStack>
}
