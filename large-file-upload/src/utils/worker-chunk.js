import { createChunk } from './chunk'

self.onmessage = (e) => {
  const { file, chunkSize, start, end } = e.data
  for (let i = start; i < end; i++) {
    createChunk(file, i, chunkSize).then((res) => {
      postMessage({ chunkIndex: i, chunk: res })
    })
  }
}
