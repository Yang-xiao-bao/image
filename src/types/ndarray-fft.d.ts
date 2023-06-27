declare module 'ndarray-fft' {
  import {NdArray} from 'ndarray'
  export default function fft(dir: 1 | -1, real: NdArray,imag: NdArray): void
}
