
import { promiseWithResolvers } from './withResolvers'

const THREAD_COUNT = navigator.hardwareConcurrency || 1

function cutInWorker({ file, chunkSize, start, end, }) {
  const { promise, resolve } = promiseWithResolvers()
  let count = end - start
  const worker = new Worker(new URL('./workers/chunk.js', import.meta.url), { type: 'module' })
  worker.postMessage({ file, chunkSize, start, end, })
  worker.onmessage = (e) => {
 
    const { chunkIndex, chunk } = e.data
    result[chunkIndex] = chunk
    count--;
    if (count === 0) {
      worker.terminate()
      resolve(result)
    }
  }
  return promise
}

export function cutFile(file, chunkSize) {
  const chunkCount = Math.ceil(file.size / chunkSize)
  const threadChunksCount = Math.ceil(chunkCount / THREAD_COUNT)
  let result = []
  for (let i = 0; i < THREAD_COUNT; i++) {
    const start = i * threadChunksCount
    const end = Math.min((i + 1) * threadChunksCount, chunkCount)
    result.push(cutInWorker({ file, chunkSize, start, end, }))
  }
  const { promise, resolve } = promiseWithResolvers()
  Promise.all(result).then((res) => {
    const arrayLike = res.reduce((prev, next) => {
      return { ...prev, ...next }
    }, { length: chunkCount })
    const chunks = Array.from(arrayLike)
    const worker = new Worker(new URL('./workers/file-hash.js', import.meta.url), { type: 'module' })
    worker.postMessage({ chunks })
    worker.onmessage = (e) => {
      const md5 = e.data
      worker.terminate()
      console.log(md5);
      resolve({ chunks, md5 })
    }
    return chunks
  })

  return promise
}



function wait(ms) {
  let resolve
  const promise = new Promise((res) => {
    resolve = res
   
  })
  setTimeout(resolve, ms)
  return promise
}
