import { FFTW, instantiateFFTWModuleFromFile } from '@shren/fftw-js'
import url from '../fftw/libfftw3.js?url'
import wasm from '../fftw/libfftw3.wasm?url'
const module = await instantiateFFTWModuleFromFile(url,wasm)
const fftw = new FFTW(module)

export function fft(real: Float32Array, imag: Float32Array,
  width: number, height: number
) {

  const data = new Float32Array(width * height * 2)
  for (let i = 0; i < real.length; i++) {
    data[i * 2] = real[i]
    data[i * 2 + 1] = imag[i]
  }
  const fft = new fftw.c2c.FFT2D(
    height,
    width)
  const fftData = fft.forward(data)
  const real1 = new Float32Array(width * height)
  const imag1 = new Float32Array(width * height)
  for (let i = 0; i < fftData.length; i += 2) {
    real1[i / 2] = fftData[i]
    imag1[i / 2] = fftData[i + 1]
  }
  fft.dispose()
  return [real1, imag1]
}

export function ifft(real: Float32Array, imag: Float32Array,
  width: number, height: number) {
  const data = new Float32Array(width * height * 2)
  for (let i = 0; i < real.length; i++) {
    data[i * 2] = real[i]
    data[i * 2 + 1] = imag[i]
  }
  const fft = new fftw.c2c.FFT2D(
    height,
    width)
  const fftData = fft.inverse(data)
  const real1 = new Float32Array(width * height)
  const imag1 = new Float32Array(width * height)
  for (let i = 0; i < fftData.length; i += 2) {
    real1[i / 2] = fftData[i] / real.length
    imag1[i / 2] = fftData[i + 1] / real.length
  }
  fft.dispose()
  return [real1, imag1]
}
