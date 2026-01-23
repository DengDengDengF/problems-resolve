<template>
  <h1>当前速度：{{averageSpeed}} mb/s </h1>
  <h2>目标速度：{{currentSpeed}}mb/s</h2>
  <p>运算结果：{{ computedRes }}</p>
  <el-scrollbar :height="500" always>
    <div v-for="item in  fileList" class="lists">
      <div class="lists-item">
        <div class="left">{{ item.file.name }}</div>
        <div class="right">
          <span>{{ item.md5 }}</span>
          <span>{{ item.progress }}</span>
        </div>
      </div>
    </div>
  </el-scrollbar>
  <input
      v-if="isUploaded"
      type="file"
      @change="fileChange"
      ref="uploadRef"
      :webkitdirectory="true"
      :multiple="true"
      accept="."
  />
</template>

<script setup lang="ts">
/**
 * UI 层展示 MD5 计算进度，同时监控 CPU、内存和磁盘吞吐效率（需要额外工具）
 * 主线程，控制磁盘吞吐效率。
 * 设计目标：
 * - 找到相对稳定的参数，提升计算稳定性，同时尽量降低对系统吞吐的影响
 * - 实时进度反馈给 UI
 * - 使用多线程计算 MD5，防止阻塞主线程
 * - 保持同步：worker 并行计算与接口上传并发结合，提高整体效率
 *   （接口并发实现参考云视频 uploadLib.ts）
 * - 以确定性方式计算 MD5（结果与全量顺序读取一致）
 * - 在大文件哈希过程中避免打满用户磁盘 I/O
 * - 通过动态 sleep 将磁盘吞吐稳定在 TARGET_BPS 附近
 * - 保证运行稳定（不抖动）、对浏览器友好、可安全中断
 *
 * 实现策略：
 * - 采用工作池 + 队列 + 单例模式分配线程，worker.ts 负责 MD5 计算和性能均衡
 * - worker 通过消息通知更新单例中的进度状态
 * - 采取保守策略：使用逻辑线程的一半进行 MD5 计算，尽量不影响用户其他操作
 * - MD5 计算完成后，将结果交给上传库处理，上传库自身有并发控制机制
 *   并同样通过单例模式管理任务状态
 * - 按固定大小分片顺序读取文件
 * - 在时间窗口内统计真实磁盘读取速率
 * - 使用 EWMA（指数加权平均）平滑瞬时波动
 * - 通过负反馈控制动态调整分片之间的 sleep 时间 以及 上下限，动态调整目标磁盘速率,动态调整。
 */
import {ref} from 'vue'
const logical = navigator.hardwareConcurrency || 4 //逻辑核心
// const net = 5//网络接口同时并发5
// const workerCount = Math.min(net, Math.max(1, logical >> 1))
const workerCount = Math.max(1, logical >> 1) //真实并行
const fileList = ref<any[]>([])
let taskQueue: any[] = []
let workPool: any[] = []
const isUploaded = ref<boolean>(true)
const computedRes = ref<string>('')
const averageSpeed=ref<number>(0)
const currentSpeed=ref<number>(0)
const initFile = (file: File) => ({progress: '', file, md5: '',bps:0,elap:0})
const getSizeSum = () => {
  const totalBytes = fileList.value.reduce((total, item) => total + (item.file?.size || 0), 0)
  if (totalBytes < 1024) {
    return totalBytes + ' B'
  } else if (totalBytes < 1024 * 1024) {
    return +(totalBytes / 1024).toFixed(2) + ' KB'
  } else if (totalBytes < 1024 * 1024 * 1024) {
    return +(totalBytes / 1024 / 1024).toFixed(2) + ' MB'
  } else {
    return +(totalBytes / 1024 / 1024 / 1024).toFixed(2) + ' GB'
  }
}

const calcSleepRange = ({chunkSize, targetBps, min=20, max=180}) => {
  const idealChunkTime = (chunkSize / targetBps) * 1000
  const min_sleep = Math.max(min, Math.floor(idealChunkTime * 0.6))
  const max_sleep = Math.max(Math.min(max, Math.ceil(idealChunkTime * 1.6)), min)
  return {min_sleep, max_sleep, idealChunkTime}
}

const startWorker = (item: any) => {
  return new Promise((resolve, reject) => {
    const file = item.file
    const worker = new Worker(new URL('./worker.ts', import.meta.url), {type: 'module'})
    item._worker = worker
    //注册全局实例
    if (!window.__ioCoordinator) {
      //分片大小
      const CHUNK_SIZE = 4 * 1024 * 1024, //分片大小
          targetBps =60 * 1024 * 1024//分片的目标速率
      //动态计算sleep区间
      const {min_sleep, max_sleep} = calcSleepRange({
        chunkSize: CHUNK_SIZE,
        targetBps: targetBps,
      })
      window.__ioCoordinator = {
        avgBps: 0,//平均读取速度
        targetBps,//分片的目标速率，会动态改变
        sleepMs: min_sleep,//初始化
        min_sleep,//sleep区间，会动态改变
        max_sleep,
        target_bps_max: 60,//最大速率
        target_bps_min: 20,//最小速率
        EWMA_ALPHA: 0.15,//系数
        CHUNK_SIZE,//每一片
        ADJUST_INTERVAL: 600,//多少ms postMessage给主线程一次
        BRAKE_SPEED: 20,//刹车速度
        ACCELERATE_SPEED: 4//加速速度
      }
    }
    const coord = window.__ioCoordinator
    worker.onmessage = (e: MessageEvent) => {
      const data = e.data
      //同步进度
      if (data.progress !== undefined) {
        item.progress = (data.progress * 100).toFixed(2) + '%'
      }
      //同步磁盘吞吐参数
      if (data.stat) {
        const {bytes, elapsed} = data.stat
        item.bps = bytes
        item.elap=elapsed
        //总吞吐
        const totalBps = workPool.reduce((sum, w) => {
          return sum + (w.bps || 0)
        }, 0)
        //总持续
        const totalElap = workPool.reduce((sum, w) => {
          return sum + (w.elap || 0)
        }, 0)
        //平均速率
        const instantBps = totalBps / (totalElap / 1000)
        //平滑平均速率 0.8的过去 0.2的现在
        coord.avgBps = coord.avgBps
            ? coord.avgBps * (1 - coord.EWMA_ALPHA) + instantBps * coord.EWMA_ALPHA
            : instantBps
        averageSpeed.value = coord.avgBps * workPool.length / (1024 * 1024)
        currentSpeed.value=coord.targetBps * workPool.length  / (1024 * 1024)
        const ratio = coord.avgBps / coord.targetBps
        //超过5% 以及 低了10%，对应刹车以及提速。
        if (ratio > 1.05) {
          coord.sleepMs = Math.min(
              coord.max_sleep,
              coord.sleepMs + Math.ceil((ratio - 1) * coord.BRAKE_SPEED),
          )
        } else if (ratio < 0.9) {
          coord.sleepMs = Math.max(
              coord.min_sleep,
              coord.sleepMs - coord.ACCELERATE_SPEED,
          )
        }
        /**
         * 动态调整目标吞吐 (自适应硬盘能力)
         * - 实际速度 低于 目标的 80%，说明磁盘受限，降低 targetBps 10%
         * - 实际速度 高于 目标的 110%，说明磁盘还有余量，提高 targetBps 10%
         */
        if (coord.avgBps < coord.targetBps * 0.8) {
          coord.targetBps = Math.max(coord.target_bps_min * 1024 * 1024, coord.targetBps * 0.9)
        } else if (coord.avgBps > coord.targetBps * 1.1) {
          coord.targetBps = Math.min(coord.target_bps_max * 1024 * 1024, coord.targetBps * 1.1)
        }
        //动态调整sleep区间
        const {min_sleep, max_sleep} = calcSleepRange({
          chunkSize: coord.CHUNK_SIZE,
          targetBps: coord.targetBps,
        })
        coord.min_sleep = min_sleep
        coord.max_sleep = max_sleep
        workPool.forEach(w => {
          if (w._worker) {
            w._worker.postMessage({
              control: {
                status:1,
                sleepMs: coord.sleepMs,
                CHUNK_SIZE:coord.CHUNK_SIZE,
                ADJUST_INTERVAL:coord.ADJUST_INTERVAL
              },
            })
          }
        })
      }
      if (data.done) {
        item.md5 = data.md5
        item.progress = '100%'
        worker.terminate()
        item._worker = null
        resolve('')
      }
    }
    worker.onerror = (e: ErrorEvent) => {
      console.error('Worker 出错:', e.message, '行号:', e.lineno, '列号:', e.colno)
      worker.terminate()
      item._worker = null
      reject()
    }
    worker.postMessage({
      file,
      control: {
        sleepMs: coord.sleepMs,
        CHUNK_SIZE:coord.CHUNK_SIZE,
        ADJUST_INTERVAL:coord.ADJUST_INTERVAL,
        status:0 //0未运行 1运行中
      },
    })
  })
}

const computedFile = () => {
  isUploaded.value = false
  const start = performance.now()
  computedRes.value = '...'
  if (taskQueue.length == 0) {
    isUploaded.value = true
    const duration = (performance.now() - start) / 1000
    const size = getSizeSum()
    computedRes.value = fileList.value.length + '个文件,' + size + ',' + workerCount + '线程，执行 ' + duration + ' 秒'
    return
  }
  const runTask = async () => {
    if (taskQueue.length == 0 && workPool.length == 0) {
      isUploaded.value = true
      const duration = (performance.now() - start) / 1000
      const size = getSizeSum()
      computedRes.value = fileList.value.length + '个文件,' + size + ',' + workerCount + '线程，执行 ' + duration + ' 秒'
      return
    }
    while (taskQueue.length > 0 && workPool.length < workerCount) {
      const item = taskQueue.shift()
      workPool.push(item)
      try {
        await startWorker(item)
        //准备根据协议不通http1.1 5个接口并发上传
      } finally {
        const poolIndex = workPool.findIndex((data) => data.file == item.file)
        if (poolIndex > -1) workPool.splice(poolIndex, 1)
        Promise.resolve().then(runTask)
      }
    }
  }
  for (let i = 0; i < workerCount; i++) Promise.resolve().then(runTask)
}


const fileChange = async (event: any) => {
  const lists: any[] = Array.from(event.target?.files || [])
  if (lists.length == 0) return
  if (fileList.value.length > 0) fileList.value.length = 0
  for (let file of lists) {
    fileList.value.push(initFile(file))
    taskQueue.push(fileList.value[fileList.value.length - 1])
  }
  if (isUploaded.value) computedFile()
  event.target.value = ''
}
</script>

<style scoped>
.lists {
  display: flex;
  flex-direction: column;

  .lists-item {
    display: flex;

    .left {
      width: 50%;
    }

    .right {
      width: 50%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>