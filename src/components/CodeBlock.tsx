import hl from 'highlight.js'
import { JSX } from 'solid-js'
import {  createEffect, createResource, createSignal } from 'solid-js'

export function CodeBlock(props: { url: string }) {

  const [res] = createResource(
    // 注意不能用props.url,来替代()=>props.url,
    // 也不能将props.url 直接写到下面的async 函数里
    // 否则将失去reactive
    () => props.url,
    async (url: string) => {
      const resp = await fetch(url)
      return resp.text()
    })
  const render = () => {
    const el = <pre><code>{res()}</code></pre>
    hl.highlightElement(el as any)
    return el
  }
  return <div>
    {
      res.loading ? 'loading'
        : render()
    }
  </div>
}

export function Highlight(props: { code:string }) {
  const code=<code>{props.code}</code> as HTMLElement
  const el = <pre>{code}</pre> as HTMLPreElement
  createEffect(() => {
    el.innerHTML=`<code>${props.code}</code>`
    hl.highlightElement(el as any);
  })
  return el
}
