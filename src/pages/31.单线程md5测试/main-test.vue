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
import { ref } from 'vue'
import { createMD5 } from 'hash-wasm'

const md5HasherPromise = createMD5()
const flag = ref<boolean>(true)

const fileChange = async (event: Event) => {
  flag.value = false
  const files = Array.from((event.target as HTMLInputElement)?.files || [])
  if (files.length === 0) return

  const md5Hasher = await md5HasherPromise
  const startTime = performance.now()

  for (const file of files) {
    const size = file.size
    const MB = 1024 * 1024
    const chunkSize = 4 * MB  // 可调：2MB~8MB 测试甜点

    md5Hasher.init()

    // ───────────────────────────────────────────────
    // 推荐：纯 stream 方式（内存更可控、无大 concat）
    // ───────────────────────────────────────────────
    const stream = file.stream()
    const reader = stream.getReader()

    let processedBytes = 0

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        if (value && value.byteLength > 0) {
          // 直接 update（value 已是 Uint8Array）
          // 如果报错“不允许”，改成 new Uint8Array(value) 即可
          md5Hasher.update(value)
          // md5Hasher.update(new Uint8Array(value))  // 强制包装，防类型问题

          processedBytes += value.byteLength

          // 每处理 32MB 让出一下（帮 GC + 避免浏览器卡顿/限流）
          if (processedBytes % (32 * MB) === 0) {
            await new Promise(r => setTimeout(r, 0))
            // 或 await new Promise(r => requestIdleCallback(r)) 如果支持
          }
        }
      }

      const digest = md5Hasher.digest()  // 默认返回 hex string
      console.log(`MD5 (${file.name}): ${digest}`)
    } finally {
      reader.releaseLock()
    }

    // ───────────────────────────────────────────────
    // 备选：如果你想对比测试 arrayBuffer 方式，可注掉上面，启用下面
    // ───────────────────────────────────────────────
    /*
    let offset = 0
    md5Hasher.init()

    while (offset < size) {
      const sliceEnd = Math.min(offset + chunkSize, size)
      const slice = file.slice(offset, sliceEnd)
      const buffer = await slice.arrayBuffer()
      md5Hasher.update(new Uint8Array(buffer))

      offset = sliceEnd

      // 显式释放引用 + 让出
      // buffer = null  // 现代浏览器 GC 友好，可省
      await new Promise(r => setTimeout(r, 0))
    }

    const digest = md5Hasher.digest()
    console.log(`MD5 (${file.name}): ${digest}`)
    */
  }

  const duration = performance.now() - startTime
  console.log('总耗时:', (duration / 1000).toFixed(3), 's')

  // 重置 input，避免重复触发
  ;(event.target as HTMLInputElement).value = ''
  flag.value = true
}
</script>

<style scoped>
/* ... */
</style>