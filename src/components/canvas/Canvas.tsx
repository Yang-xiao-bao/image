import { children, createContext, useContext } from 'solid-js'

const Context = createContext<CanvasRenderingContext2D | null>(null)

export type CanvasProps = {
  width: number
  height: number
  children?: any
}
export function Canvas(props: CanvasProps) {
  const canvas = <canvas width={props.width} height={props.height} /> as HTMLCanvasElement
  const ctx = canvas.getContext('2d')!
  return <Context.Provider value={ctx} >
    {canvas}
    {children(() => {
      return props.children
    })}
  </Context.Provider>
}

export function useRenderingContext() {
  const ctx = useContext(Context)!
  if (!ctx) throw new Error('No rendering context')
  return ctx
}
