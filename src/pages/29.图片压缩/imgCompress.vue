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
/**
 * 图片压缩流程说明（当前实现）
 *
 * 本方案采用「分辨率压缩 + JPEG质量二分搜索」的组合策略，
 * 在保证视觉质量的前提下，将图片压缩至目标体积附近。
 *
 * -----------------------------
 * 一、整体流程
 * -----------------------------
 * 1. 解码图片（createImageBitmap）
 *    - 将原始图片（jpg/png）解码为 bitmap（RGBA像素数据）
 *    - 该步骤只执行一次，避免重复解码带来的性能和内存开销
 *
 * 2. 分辨率压缩（缩放）
 *    - 根据 maxWidth / maxHeight 计算缩放比例
 *    - 使用 canvas.drawImage 进行重采样
 *    - 这是第一层压缩（降低像素数量，显著减少体积）
 *
 * 3. JPEG 编码压缩（质量控制）
 *    - 使用 canvas.convertToBlob({ quality })
 *    - 通过降低 quality（0~1）来减少文件大小
 *    - 这是第二层压缩（有损压缩）
 *
 * 4. 二分搜索逼近目标体积
 *    - 目标：将图片压缩到 targetSize（如 400KB）
 *    - 先用 probe（默认 quality=0.6）做一次预估
 *    - 根据体积差计算初始质量区间
 *    - 使用二分法逐步逼近目标体积
 *
 * -----------------------------
 * 二、核心优化点
 * -----------------------------
 *
 * 1. bitmap 复用（关键优化）
 *    - 避免在每次压缩循环中重复 createImageBitmap
 *    - 将“解码”从 O(n) 降为 O(1)
 *    - 显著降低 CPU 和内存占用
 *
 * 2. canvas 复用
 *    - 所有压缩过程共用一个 OffscreenCanvas
 *    - 避免重复创建大尺寸 buffer
 *    - 减少 GC 压力
 *
 * 3. 二分搜索代替暴力尝试
 *    - 压缩次数从线性搜索降低到 log(n)
 *    - 一般 6~12 次即可收敛
 *
 * 4. 质量预测优化（经验公式）
 *    - 使用 q = q_probe * (ratio ^ 0.85)
 *    - 提前缩小搜索区间，减少无效压缩次数
 *
 * -----------------------------
 * 三、内存模型
 * -----------------------------
 *
 * 压缩过程中主要内存占用：
 *
 * - bitmap（解码后）：width × height × 4 bytes
 * - canvas buffer：同上
 * - 临时编码数据：少量
 *
 * 峰值内存约为：
 *   ≈ 2 × 像素内存（bitmap + canvas）
 *
 * 示例：
 *   4000 × 3000 ≈ 48MB（bitmap）
 *   总占用 ≈ 80MB ~ 120MB
 *
 * -----------------------------
 * 四、性能特性
 * -----------------------------
 *
 * - 解码只执行一次（避免重复高成本操作）
 * - 压缩过程为 CPU 密集型（JPEG编码）
 * - 主线程执行时可能造成卡顿（建议后续放入 Web Worker）
 *
 * -----------------------------
 * 五、适用场景
 * -----------------------------
 *
 * ✔ 上传前图片压缩
 * ✔ 单张或少量图片处理
 * ✔ 对体积有明确要求（如限制 400KB）
 *
 * -----------------------------
 * 六、注意事项
 * -----------------------------
 *
 * 1. 必须在结束后调用 bitmap.close()
 *    - 否则会导致内存无法及时释放
 *
 * 2. URL.createObjectURL 需配合 revokeObjectURL
 *    - 避免内存泄漏
 *
 * 3. 批量图片需控制并发
 *    - 建议同时处理 2~3 张
 *    - 防止内存峰值过高
 *
 * -----------------------------
 * 七、一句话总结
 * -----------------------------
 *
 * 本方案通过：
 * 「降低分辨率 + 控制JPEG质量 + 二分搜索」
 * 在性能、内存和压缩效果之间取得平衡，
 * 属于前端图片压缩的工程级实现方案。
 */
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

const targetSize = 400 * 1024
const maxWidth = 1440
const maxHeight = 2560
const MIN_QUALITY = 0.5

async function onFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  info.value = '压缩中，请稍候...'
  originSrc.value = URL.createObjectURL(file)
  originSize.value = Math.round(file.size / 1024)
  let blob
  try {
     blob = await compressToTargetSize(file)
    if (!blob) {
      info.value = '<span style="color:red;">压缩失败</span>'
      return
    }
    compressSrc.value = URL.createObjectURL(blob)
    compressSize.value = Math.round(blob.size / 1024)
    info.value = `<span style="color:green;">压缩成功！节省 ${savePercent.value}%</span>`
  } catch (e) {
    console.error(e)
    info.value = '<span style="color:red;">压缩异常</span>'
  }finally{
    URL.revokeObjectURL(blob)
    URL.revokeObjectURL(file)
  }
}

/**
 * 核心压缩（bitmap + canvas复用）
 */
async function compressToTargetSize(file) {
  // ✅ 1. 只 decode 一次
  const bitmap = await createImageBitmap(file)

  // ✅ 2. 尺寸计算只做一次
  const scale = Math.min(
      1,
      maxWidth / bitmap.width,
      maxHeight ? maxHeight / bitmap.height : 1
  )

  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  // ✅ 3. canvas 复用
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法获取 canvas 上下文')

  const draw = () => {
    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(bitmap, 0, 0, width, height)
  }

  let low = 0.3
  let high = 0.98
  let bestBlob = null

  // ✅ 4. probe
  draw()
  const probeQuality = 0.6
  let probeBlob = await canvas.convertToBlob({
    type: 'image/jpeg',
    quality: probeQuality
  })

  if (probeBlob.size <= targetSize + 2048) {
    bitmap.close()
    return probeBlob
  }

  // ✅ 5. 估算probe质量
  const ratio = targetSize / probeBlob.size
  let qGuess = probeQuality * Math.pow(ratio, 0.85)
  qGuess = Math.max(MIN_QUALITY, Math.min(0.98, qGuess))

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

  // ✅ 6. 二分搜索（不再重复 decode！）
  for (let i = 0; i < 12; i++) {
    const mid = (low + high) / 2
    if (mid < MIN_QUALITY) break

    draw()

    const blob = await canvas.convertToBlob({
      type: 'image/jpeg',
      quality: mid
    })
    if (blob.size > targetSize + 2048) {
      high = mid
    } else {
      low = mid
      bestBlob = blob
    }
    if (high - low < 0.01) break
  }
  // ✅ 7. 释放 bitmap（非常关键）
  bitmap.close()
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