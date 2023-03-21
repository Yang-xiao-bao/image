import hl from 'highlight.js'
import { createResource, createSignal } from 'solid-js'

export function CodeBlock(props: { url: string }) {
  const [res] = createResource(async () => {
    const resp = await fetch(props.url)
    return resp.text()
  })
  const render = ()=>{
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
