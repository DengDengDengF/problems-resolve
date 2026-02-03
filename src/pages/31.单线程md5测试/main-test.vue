<template>
  <input
      type="file"
      @change="fileChange"
      ref="uploadRef"
      :webkitdirectory="true"
      :multiple="true"
      accept="."
  />
</template>

<script setup lang="ts">
import { ref} from 'vue'
import {createMD5} from 'hash-wasm'
const md5HasherPromise = createMD5();
const flag =ref<boolean>(true)
function concatUint8Arrays(a: Uint8Array, b: Uint8Array) {
  const c = new Uint8Array(a.length + b.length);
  c.set(a, 0);
  c.set(b, a.length);
  return c;
}

/**
 * 单线程顶多跑300mb/s*/
const fileChange = async (event: any) => {
  flag.value =false
  const list: any[] = Array.from(event.target?.files || [])
  if (list.length == 0) return
  const md5Hasher = await md5HasherPromise
  const startTime = performance.now()
  //直接算就完事了
  for (let i = 0; i < list.length; i++) {
    const file = list[i]
    const size =file.size
    const MB = 1024*1024
    let offset = 0
    const  chunk_size = 4 *MB
    md5Hasher.init()

    //之所以流块，是因为浏览器，底层做了优化，有提前读取。也导致了cpu 内存双双升高。
    // const stream = file.stream();
    // const reader = stream.getReader();
    //
    // let bufferChunk = new Uint8Array(0);
    //
    // while (true) {
    //   const { done, value } = await reader.read();
    //   if (done) break;
    //
    //   // 合并 value 到 bufferChunk
    //   bufferChunk = concatUint8Arrays(bufferChunk, value);
    //
    //   // 每当 bufferChunk 达到 chunk_size，就处理一次
    //   while (bufferChunk.length >= chunk_size) {
    //     const chunk = bufferChunk.subarray(0, chunk_size);
    //     md5Hasher.update(chunk);
    //
    //     // 剩余的保留到 bufferChunk
    //     bufferChunk = bufferChunk.subarray(chunk_size);
    //
    //     // 可插入延迟，模拟设备情况
    //     // await sleep(10);
    //   }
    // }
    //
    // // 处理最后剩余不足 chunk_size 的部分
    // if (bufferChunk.length > 0) {
    //   md5Hasher.update(bufferChunk);
    // }

    while (offset < size) {
      const slice = file.slice(offset, offset + chunk_size)
      let buffer = await slice.arrayBuffer()
      //TODO 可在此处加定时器，模拟地设备情况。
      md5Hasher.update(new Uint8Array(buffer))
      offset += chunk_size
      buffer = null
    }
    // console.log(`thread${_index}-${file.name}`, 'done')
    md5Hasher.digest()
  }
  const duration = performance.now() - startTime; // 也可用 performance.now()
  console.log('耗时秒:', (duration / 1000).toFixed(3), 's');
  event.target.value = ''
  flag.value=true
}
</script>

<style scoped>

</style>