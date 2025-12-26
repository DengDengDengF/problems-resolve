<template>
  <div>
    <input type="file" accept="image/*" @change="onFileChange" />
    <p v-html="info"></p>

    <div class="wrap">
      <div class="box">
        <h4>原图</h4>
        <img :src="originSrc" alt="原图" />
        <p>大小: {{ originSize }} KB</p>
      </div>
      <div class="box">
        <h4>压缩后（JPEG）</h4>
        <img :src="compressSrc" alt="压缩后" />
        <p>大小: {{ compressSize }} KB（节省 {{ savePercent }}%）</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const originSrc = ref('')
const compressSrc = ref('')
const info = ref('请选择图片')
const originSize = ref(0)
const compressSize = ref(0)

const savePercent = computed(() => {
  if (originSize.value === 0) return 0
  return ((1 - compressSize.value / originSize.value) * 100).toFixed(1)
})
const targetSize = 400 * 1024 // 目标大小 400KB，可自行调整
const maxWidth = 1440
const maxHeight = 2560
const MIN_QUALITY = 0.5 // 最低质量保护，防止图片严重失真

async function onFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return

  info.value = '压缩中，请稍候...'
  originSrc.value = URL.createObjectURL(file)
  originSize.value = Math.round(file.size / 1024)

  const blob = await compressToTargetSizeVerbose(file, targetSize, {
    maxWidth,
    maxHeight,
    type: 'image/jpeg' // 强制 JPEG
  })

  if (!blob) {
    info.value = '<span style="color:red;">压缩失败</span>'
    return
  }

  compressSrc.value = URL.createObjectURL(blob)
  compressSize.value = Math.round(blob.size / 1024)
  info.value = `<span style="color:green;">压缩成功！节省 ${savePercent.value}%</span>`
}

/**
 * OffscreenCanvas 压缩（Worker-safe）
 */
async function compressImageWorkerSafe(blob, { maxWidth = 800, maxHeight, quality = 0.8, type = 'image/jpeg' } = {}) {
  const bitmap = await createImageBitmap(blob)
  const scale = Math.min(1, maxWidth / bitmap.width, maxHeight ? maxHeight / bitmap.height : 1)
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法获取 canvas 上下文')

  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  return await canvas.convertToBlob({ type, quality })
}

/**
 * 优化版二分压缩（JPEG专用）
 */
async function compressToTargetSizeVerbose(file, targetSize, options) {
  let low = 0.3
  let high = 0.98
  let bestBlob = null

  // 1. 预探针（用中等质量快速估算）
  const probeQuality = 0.6
  const probeBlob = await compressImageWorkerSafe(file, { ...options, quality: probeQuality })
  console.log(`Probe: quality=${probeQuality}, size=${(probeBlob.size / 1024).toFixed(1)} KB`)

  // 如果探针已经够小，直接返回
  if (probeBlob.size <= targetSize + 2048) { // 允许 ±2KB 误差
    return probeBlob
  }

  // 2. 优化 q_guess（JPEG 经验公式）
  const ratio = targetSize / probeBlob.size
  let qGuess = probeQuality * Math.pow(ratio, 0.85) // 0.85 是 JPEG 经验最佳指数
  qGuess = Math.max(MIN_QUALITY, Math.min(0.98, qGuess))

  // 3. 动态调整二分搜索范围
  if (ratio > 1.2) {
    low = qGuess
    high = Math.min(0.98, qGuess + 0.2)
  } else if (ratio < 0.8) {
    high = qGuess
    low = Math.max(MIN_QUALITY, qGuess - 0.2)
  } else {
    low = Math.max(MIN_QUALITY, qGuess - 0.12)
    high = Math.min(0.98, qGuess + 0.12)
  }

  console.log(`q_guess=${qGuess.toFixed(3)}, range=[${low.toFixed(3)}, ${high.toFixed(3)}]`)

  // 4. 二分迭代
  for (let i = 0; i < 12; i++) {
    const mid = (low + high) / 2
    if (mid < MIN_QUALITY) break // 质量太低，停止

    const blob = await compressImageWorkerSafe(file, {...options, quality: mid})

    console.log(`Iteration ${i + 1}: quality=${mid.toFixed(3)}, size=${(blob.size / 1024).toFixed(1)} KB`)

    if (blob.size > targetSize + 2048) {
      high = mid
    } else {
      low = mid
      bestBlob = blob
    }

    if (high - low < 0.01) break
  }

  return bestBlob || probeBlob
}
</script>

<style scoped>
.wrap {
  display: flex;
  gap: 40px;
  margin-top: 20px;
  justify-content: center;
}

.box {
  text-align: center;
  width: 400px;
}

img {
  max-width: 100%;
  max-height: 600px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

p {
  margin-top: 10px;
  font-size: 14px;
  color: #666;
}
</style>