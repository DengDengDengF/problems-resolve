<template>
  <h1>当前:{{ averageSpeed }}</h1>
  <h2>目标:{{ currentSpeed }}</h2>
  <p>运算结果：{{ computedRes }}</p>
  <el-scrollbar :height="500" always>
    <div v-for="item in  fileList" class="lists">
      <div class="lists-item">
        <div class="left">{{ item.file.name }}</div>
        <div class="right">
          <span>{{ item.md5 }}</span>
          <span v-if="item.errorMsg" style="color: red">{{item.errorMsg}}</span>
          <span v-else>{{ item.progress }}</span>
        </div>
      </div>
    </div>
  </el-scrollbar>
  <div style="display: flex;gap:10px">
    <input
        v-if="isUploaded"
        type="file"
        @change="fileChange"
        ref="uploadRef"
        :webkitdirectory="true"
        :multiple="true"
        accept="."
    />
    <el-button type="primary" @click="clear">终止线程</el-button>
    <el-button type="primary" @click="test"> test</el-button>
  </div>
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
 *
 * tips: 适配本次算法的是 瞬时速率 instanceBps=  Σbps / max(elap)
 * 还有一种是 保守方式，刻意压低速率 instanceBps=  Σbps / Σelap
 */
import {onUnmounted, ref} from 'vue'

const logical = navigator.hardwareConcurrency || 4 //逻辑核心
// const net = 5//网络接口同时并发5
// const workerCount = Math.min(net, Math.max(1, logical >> 1))
const workerCount = Math.max(1, logical >> 1) //真实并行
const fileList = ref<any[]>([])
let taskQueue: any[] = []
let workPool: any[] = []
const isUploaded = ref<boolean>(true)
const computedRes = ref<string>('')
const averageSpeed = ref<string>('')
const currentSpeed = ref<string>('')
const INIT_BPS = 90 * 10 * 1024 * 1024 / workerCount //分片默认速率上限

//初始化文件实例
const initFile = (file: File) => ({progress: '', file, md5: '', bps: 0, elap: 0,errorMsg:''})
//返回正确的单位
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
/**
 * @description 测量sleep区间
 * @param chunkSize 分片大小
 * @param targetBps 调整后的分片目标速率
 * @param min sleep下限
 * @param max sleep 上限*/
const calcSleepRange = ({chunkSize, targetBps, min = 20, max = 180}) => {
  const idealChunkTime = (chunkSize / targetBps) * 1000
  const min_sleep = Math.max(min, Math.floor(idealChunkTime * 0.6))
  const max_sleep = Math.max(Math.min(max, Math.ceil(idealChunkTime * 1.6)), min)
  return {min_sleep, max_sleep, idealChunkTime}
}
/**@description 多线程自适应节流调度器
 * @param poolItem worker线程实例*/
const startWorker = (poolItem: any) => {
  return new Promise((resolve, reject) => {
    const task = poolItem.task
    const worker = poolItem._worker
    const file = task.file
    //注册全局实例
    if (!window.__ioCoordinator) {
      //分片大小
      const CHUNK_SIZE = 4 * 1024 * 1024, //分片大小
          targetBps = INIT_BPS//分片的目标速率
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
        target_bps_max: INIT_BPS,//理想最大速率，动态增加的参照
        target_bps_min: 20,//理想最小速率，动态减小的参照
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
        task.progress = (data.progress * 100).toFixed(2) + '%'
      }
      //同步磁盘吞吐参数
      if (data.stat) {
        const {bytes, elapsed} = data.stat
        task.bps = bytes
        task.elap = elapsed
        /**
         * 求瞬时平均速率
         * -instanceBps= Σbps / max(elap)*/
        const totalBps = workPool.reduce((sum, w) => {
          return sum + (w?.task?.bps || 0)
        }, 0)
        const maxElap = Math.max(
            ...workPool.map(w => w?.task?.elap || 0)
        )
        const instantBps = totalBps / (maxElap / 1000)
        const alpha = coord.EWMA_ALPHA
        /**
         * 平滑平均速率
         * -avgBps = (1-alpha)的过去+alpha的现在*/
        coord.avgBps = coord.avgBps
            ? coord.avgBps * (1 - alpha) + instantBps * alpha
            : instantBps
        averageSpeed.value = (coord.avgBps  / (1024 * 1024)).toFixed(1) + 'MB/s'
        currentSpeed.value = (coord.targetBps  / (1024 * 1024)).toFixed(1) + 'MB/s'
        document.title = 'ave:' + averageSpeed.value + ' cur:' + currentSpeed.value
        const ratio = coord.avgBps / coord.targetBps
        /**
         * 刹车或提速
         * -超过5%刹车
         * -慢了10%提速*/
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
         * 动态调整目标吞吐 (自适应硬盘能力，尽量最大化磁盘利用)：
         * - 如果实际速度 < 目标的 80%，说明磁盘受限，降低 targetBps 10% 以防堵塞
         * - 如果实际速度 > 目标的 110%，说明磁盘还有余量，提高 targetBps 10% 利用更多带宽
         * - 再低不能低过下限，再高要比上限高
         * - 保证 targetBps 在 min/max 范围内，动态适配磁盘性能波动
         */
        if(coord.avgBps > coord.targetBps * 0.3){
          if (coord.avgBps < coord.targetBps * 0.8) {
            coord.targetBps = Math.max(coord.target_bps_min * 1024 * 1024, coord.targetBps * 0.9)
          } else if (coord.avgBps > coord.targetBps * 1.1) {
            coord.targetBps = Math.min(coord.target_bps_max * 1024 * 1024, coord.targetBps * 1.1)
          }
        }
        /**
         * 动态调整sleep区间：
         * -根据分片大小 以及 收到动态吞吐调整下的targetBps(目标速率)*/
        const {min_sleep, max_sleep} = calcSleepRange({
          chunkSize: coord.CHUNK_SIZE,
          targetBps: coord.targetBps,
        })
        coord.min_sleep = min_sleep
        coord.max_sleep = max_sleep
        /**
         * 通知在执行任务的线程*/
        const hasItemPool = workPool.filter((v) => v.task)
        hasItemPool.forEach(w => {
          if (w._worker) {
            w.control = {
              status: 1,
              sleepMs: coord.sleepMs,
              CHUNK_SIZE: coord.CHUNK_SIZE,
              ADJUST_INTERVAL: coord.ADJUST_INTERVAL
            }
            w._worker.postMessage({
              control: w.control,
            })
          }
        })
      }
      if (data.done) {
        task.md5 = data.md5
        task.progress = '100%'
        resolve('')
      }
      if (data.stop) {
        reject(`${file.name} 线程 被终止`)
      }
    }
    worker.onerror = (e: ErrorEvent) => {
      reject(e)
    }
    poolItem.control = {
      sleepMs: coord.sleepMs,
      CHUNK_SIZE: coord.CHUNK_SIZE,
      ADJUST_INTERVAL: coord.ADJUST_INTERVAL,
      status: 1 //0未运行  1运行中  2停止运行
    }
    worker.postMessage({
      file,
      control: poolItem.control
    })
  })
}
/**@description 多线程执行并行任务
 * -待开发兼容并发*/
const computedFile = () => {
  isUploaded.value = false
  const start = performance.now()
  computedRes.value = '...'
  const synComputed = () => {
    isUploaded.value = true
    const duration = (performance.now() - start) / 1000
    const size = getSizeSum()
    computedRes.value = fileList.value.length + '个文件,' + size + ',' + workerCount + '线程，执行 ' + duration + ' 秒'
  }
  const runningNum = () => workPool.filter((v) => v.control.status == 1).length
  const runTask = async (poolItem: any) => {
    //针对该线程。准备运行，但是没任务。
    if(poolItem.control.status == 0 && !poolItem.task) {
      while (taskQueue.length > 0) {
        const item = taskQueue.shift()
        try {
          poolItem.task = item
          await startWorker(poolItem)
          //准备根据协议不通http1.1 5个接口并发上传
        }catch(error){
          item.errorMsg=error.message
        } finally {
          poolItem.task = null
          if (taskQueue.length == 0) {
            poolItem.control.status = 0
            if (runningNum() == 0) synComputed()
          }
        }
      }
    }
  }
  for (let i = 0; i < workPool.length; i++) {
    const poolItem = workPool[i]
    Promise.resolve().then(() => {
      runTask(poolItem)
    })
  }
}
/**@description 文件入队列*/
const fileChange = async (event: any) => {
  const lists: any[] = Array.from(event.target?.files || [])
  if (lists.length == 0) return
  if (fileList.value.length > 0) clear()
  for (let file of lists) {
    fileList.value.push(initFile(file))
    taskQueue.push(fileList.value[fileList.value.length - 1])
  }
  if (isUploaded.value) computedFile()
  event.target.value = ''
}
/**@description 线程打断测试*/
const clear = () => {
  fileList.value.length = 0
  taskQueue.length = 0
  workPool.forEach(w => {
    if (w._worker) {
      w._worker.postMessage({
        control: {
          status: 2,
        },
      })
    }
  })
}
/**@description 初始化线程池*/
const initWorker = () => {
  clear()
  let i = 0
  while (i < workerCount) {
    const v = {
      _worker: new Worker(new URL('./worker.ts', import.meta.url), {type: 'module'}),
      _workerId: crypto.randomUUID(),
      task: null,
      control: {
        status: 0,//0准备运行 1运行中 2停止运行
        sleepMs: 0,
        CHUNK_SIZE: 0,
        ADJUST_INTERVAL: 0
      },
    }
    workPool.push(v)
    i++
  }
}
/**@description 刷页面/组件卸载 终止线程*/
const cleanupWorkers = () => {
  workPool.forEach(w => {
    if (w._worker) {
      w._worker.postMessage({control: {status: 2}}) // 告诉 Worker 停止
      w._worker.terminate() // 强制终止
      w._worker = null
    }
  })
  workPool.length = 0
}
const test = () => {
  console.log(fileList.value.filter((v) => !v.progress))
  console.log(taskQueue)
  console.log(workPool)
}
initWorker()
//浏览器调度原因，切到后台，再切回来限速解决方案
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    //TODO 后续可以初始化__ioCoordinator,然后通过节流算法自动调整。
    if (window.__ioCoordinator) {
      window.__ioCoordinator.targetBps = INIT_BPS
      window.__ioCoordinator.avgBps = INIT_BPS
    }
  }
})
// 页面刷新/关闭时
window.addEventListener('beforeunload', () => {
  cleanupWorkers()
})
onUnmounted(() => {
  cleanupWorkers()
})
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