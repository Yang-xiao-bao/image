export type Control = 'continue' | 'halt'
export type Runable<Args extends any[], TReturn = any>
  = (...args: Args) => Generator<number, TReturn, Control>
export type Runner<TReturn> = {
  start(onProgress?: (progress: number) => void): Promise<TReturn>
  stop(): void
}
export function run<Args extends any[], TReturn = any>(
  f: Runable<Args, TReturn>,
  ...args: Args): Runner<TReturn> {
  let stopSignal = false
  let timer = -1
  return {
    start(onProgress?: (progress: number) => void) {
      stopSignal = false
      const generator = f(...args)
      return new Promise<TReturn>((resolve, reject) => {
        const schedule = () => {
          timer = setTimeout(() => {
            const { value, done } = generator.next(stopSignal ? 'halt' : 'continue')
            if (!done) {
              onProgress?.(value)
              schedule()
            } else {
              if (value) {
                resolve(value)
              } else {
                reject(new Error("No value"))
              }
            }
          })
        }
        schedule()
      })
    },
    stop() {
      stopSignal = true
      clearTimeout(timer)
    }
  }
}
