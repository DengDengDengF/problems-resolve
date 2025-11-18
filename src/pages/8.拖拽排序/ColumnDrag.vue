<template>
  <div class="table-wrapper" ref="wrapper">
    <div class="table">
      <div
          v-for="(col, index) in columns"
          :key="index"
          class="col"
          :style="{ width: col.width + 'px' }"
      >
        {{ col.name }}
        <div
            v-if="index < columns.length - 1"
            class="resizer"
            @mousedown.prevent="startResize($event, index)"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'

const MIN_WIDTH = 80
const columns = reactive([
  { name: 'A', width: 0 },
  { name: 'B', width: 0 },
  { name: 'C', width: 0 },
  { name: 'D', width: 0 },
  { name: 'E', width: 0 }, // 最右列
])

let RIGHT_WIDTH = 0

const wrapper = ref(null)
let startX = 0
let currentColIndex = null
let startWidths = []

onMounted(() => {
  const containerWidth = wrapper.value.clientWidth
  const colWidth = Math.floor(containerWidth / columns.length)
  columns.forEach(col => (col.width = colWidth))
  RIGHT_WIDTH = columns[columns.length - 1].width
})

function startResize(e, index) {
  startX = e.clientX
  currentColIndex = index
  startWidths = columns.map(c => c.width)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', stopResize)
}

function onMouseMove(e) {
  if (currentColIndex === null) return

  const dx = e.clientX - startX
  const leftCol = columns[currentColIndex]
  const rightCol = columns[currentColIndex + 1]

  const isRightMost = currentColIndex + 1 === columns.length - 1
  let newLeft = startWidths[currentColIndex] + dx
  let newRight = isRightMost ? RIGHT_WIDTH : startWidths[currentColIndex + 1] - dx

  if (newLeft < MIN_WIDTH) newLeft = MIN_WIDTH
  if (!isRightMost && newRight < MIN_WIDTH) newRight = MIN_WIDTH

  // 计算总宽
  let totalWidth = columns.reduce((sum, col, idx) => {
    if (idx === currentColIndex) return sum + newLeft
    if (idx === currentColIndex + 1) return sum + newRight
    return sum + col.width
  }, 0)

  const containerWidth = wrapper.value.clientWidth

  // 总宽 < 容器，剩余空间补充到拖动列
  if (totalWidth < containerWidth) {
    newLeft += containerWidth - totalWidth
  }

  leftCol.width = newLeft
  if (!isRightMost) rightCol.width = newRight
}

function stopResize() {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', stopResize)
  currentColIndex = null
}
</script>

<style>
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid #ccc;
}

.table {
  display: flex;
  width: max-content;
}

.col {
  position: relative;
  padding: 10px;
  border-right: 1px solid #aaa;
  box-sizing: border-box;
  flex-shrink: 0;
  white-space: nowrap;
}

.resizer {
  position: absolute;
  top: 0;
  right: 0;
  width: 5px;
  height: 100%;
  cursor: ew-resize;
  background-color: transparent;
}
</style>
