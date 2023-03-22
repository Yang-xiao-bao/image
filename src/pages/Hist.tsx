import { Flex, Heading, VStack } from "@hope-ui/solid";
import { createSignal } from "solid-js";
import { match } from "ts-pattern";
import { ChannelSelector } from "../components/ChannelSelector";
import { HistBar } from "../components/HistBar";
import { ImagePreview } from "../components/ImagePreview";
import { ImageSelector } from "../components/ImageSelector";
import { Channel } from "../types/image";
import style from './Hist.module.css'

export function Hist() {
  return <VStack>
    <section>
      <Heading>直方图</Heading>
      <BasicHist />
    </section>
  </VStack>
}

function BasicHist() {
  const [image, setImage] = createSignal<ImageData | null>()
  const [channel, setChannel] = createSignal<Channel>('r')
  return <VStack spacing="4px">
    <ImageSelector onSelect={setImage} />
    <ChannelSelector value={channel()} onChange={setChannel} />
    {image() &&
      <div class={style.imgContainer} >
        <ImagePreview image={image()!} />
        {match(channel())
          .with("all", () => <div class={style.histContainer}>
            <HistBar title="Red" image={image()!} channel="r" height={"100px"} />
            <HistBar title="Green" image={image()!} channel="g" height={"100px"} />
            <HistBar title="Blue" image={image()!} channel="b" height={"100px"} />
            <HistBar title="All" image={image()!} channel='all' height={"100px"} />
          </div>)
          .otherwise((ch) => <HistBar image={image()!} channel={ch} />)
        }
      </div>
    }
  </VStack>
}
