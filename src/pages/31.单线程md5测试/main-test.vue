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