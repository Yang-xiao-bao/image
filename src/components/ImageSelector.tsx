import { Input } from '@hope-ui/solid'
import lena from '../assets/lena.gif'
import lenaGray from '../assets/lena-gray.png'
import tentalGray from '../assets/dental_xray.png'
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
import { createSignal, onMount } from 'solid-js'

const imageData = new Map<string, ImageData>()
// a function to get image data from imageData or from url then save to imageData

async function getImageData(urlOrName: string) {
  if (imageData.has(urlOrName)) {
    return imageData.get(urlOrName)!
  }
  const data = await getImageDataFromUrl(urlOrName)
  imageData.set(urlOrName, data)
  return data
}
export type ImageItem = {
  label: string
  url: string
}
export type ImageSelectorProps = {
  options?: ImageItem[]
  defaultSelect?: string
  onSelect?: (data: ImageData) => void
}
export function ImageSelector(props: ImageSelectorProps) {
  const [options, setOptions] = createSignal<{ label: string, urlOrName: string }[]>(
    (props.options?.map(item => ({ label: item.label, urlOrName: item.url })) ?? []).concat(
      [
        { label: 'Lena', urlOrName: lena },
        { label: 'Lena Gray', urlOrName: lenaGray },
        { label: 'Dental Gray',urlOrName: tentalGray  }

      ]
    )
  )
  // find option in options by label to match defaultSelect fallback to first option
  const [selected, setSelected] = createSignal(
    options().find(item => item.label === props.defaultSelect)?.urlOrName ?? options()[0].urlOrName
  )
  onMount(async () => {
    props.onSelect?.(
      await getImageData(selected())
    )
  })

  return <InputGroup>
    <InputLeftAddon>选择图片</InputLeftAddon>
    <Select
      value={selected()}
      onChange={async e => {
        if (e === "<file>") {
          const [data, name] = await selectFile()
          imageData.set(name, data)
          setOptions(opts => [...opts, { label: name, urlOrName: name }])
          setSelected(name)
          props.onSelect?.(
            data
          )
          return
        }
        props.onSelect?.(await getImageData(e))
      }}>
      <SelectTrigger>
        <SelectPlaceholder>
          选择图片
        </SelectPlaceholder>
        <SelectValue />
        <SelectIcon />
      </SelectTrigger>
      <SelectContent>
        <SelectListbox>
          <For each={options()}>
            {item => (
              <SelectOption value={item.urlOrName}>
                <SelectOptionText>{item.label}</SelectOptionText>
                <SelectOptionIndicator />
              </SelectOption>
            )}
          </For>
          <SelectOption value={"<file>"}>
            <SelectOptionText>打开本地文件</SelectOptionText>
          </SelectOption>
        </SelectListbox>
      </SelectContent>
    </Select>
  </InputGroup>
}
function selectFile() {
  const input = document.createElement("input")
  input.setAttribute("type", "file")
  input.setAttribute("accept", "image/*")
  return new Promise<[ImageData, string]>((res) => {
    input.addEventListener("change", async (e) => {
      if (input.files) {
        const url = URL.createObjectURL(input.files[0])
        const data = await getImageDataFromUrl(url)
        URL.revokeObjectURL(url)
        res([data, input.files[0].name])
      }
    })
    input.setAttribute("style", "position:fixed;visibility:hidden")
    document.body.append(input)
    input.click()
  })
}

async function getImageDataFromUrl(url: string) {
  return new Promise<ImageData>((res, rej) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const imgData = ctx.getImageData(0, 0, img.width, img.height, {
        colorSpace: 'srgb'
      })
      res(imgData)
    }
    img.onerror = rej
    img.src = url
  })

}
