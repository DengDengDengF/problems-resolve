<template>
  <el-scrollbar :height="500" always>
    <div v-for="item in  fileList" class="lists">
      <div class="lists-item">
        <div class="left">{{ item.file.name }}</div>
        <div class="right">
          <span :style="{color:md5StatusHash[item.md5Status].color}">{{ md5StatusHash[item.md5Status].value }}</span>
        </div>
      </div>
    </div>
  </el-scrollbar>
  <input
      v-if="demoTest"
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
 *
 * |-----------------------------------------------|
 * |               主线程                           |
 * |-----------------------------------------------|
 *                  | |
 *                  | |
 * |-------|------|------|------|------|------|--------|
 * |-线程1-|-线程2-|-线程3-|-线程4-|-线程5-|-线程6-|-线程7...-|
 * |------|------|------|------|------|------|--------|
 *                  ||
 *                  ||
 * |---------------------------------------------------|
 * | 槽1  | 槽2  | 槽3   |  槽4 | 槽5  | 槽6  |  槽7    |
 * |--------------------------------------------------|
 *                 监测线程
 *
 *
 * 架构设计：
 * 工作线程-监控线程：
 * -基于令牌桶(类似无锁设计)，共享桶。
 * -其他线程，原子操作，只能取自己槽中的数据,记录自己线程的剩余量，用hash-wasm分片算MD5,禁止引入定时器会影响速率准确性。
 * -监控线程，负责控制吞吐调度，往槽中分配数据
 *
 * 主线程-工作线程
 * -主线程，从共享内存，工作线程中拿到余量，均匀分配给每个线程。进度等等
 * -工作线程，维护队列，确保余量正确，结束后通知主线程等
 * **/
import {onUnmounted, ref} from 'vue'

const logical = navigator.hardwareConcurrency || 4 //逻辑核心
const workerCount = Math.max(1, logical >> 1)
const fileList = ref<any[]>([])
const fileMapList = ref<Map<string, any>>(new Map())
const demoTest = ref<boolean>(true)//test
const workerPool: any[] = []
const monitorPool: any[] = []
const md5StatusHash = {
  0: {value: '未计算', color: '#999999'},
  1: {value: '计算中', color: '#FFA500'},
  2: {value: '计算完成', color: '#28a745'},
  3: {value: '计算失败', color: '#dc3545'},
}
const _CURRENT_IO_BUCKET = new Int32Array(new SharedArrayBuffer(workerCount * 4))//共享线程工作桶单位字节
const _GT_IO_STORAGE = new Int32Array(new SharedArrayBuffer(workerCount * 4))//共享线程剩余没处理单位mb
const _RUNNING_IO_STATUS = new Int32Array(new SharedArrayBuffer(workerCount * 4))//WORKER是否在处理任务，没在处理0，在处理1
const initFile = (file: File) => ({file, md5: '', errorMsg: '', uid: crypto.randomUUID(), md5Status: 0})//md5Status:0未计算 1计算中 2计算完成 3计算失败

//二次分配，确保list是排过序的，为了均匀
const rangeArray = (list: any[]) => {
  let sizeMixed = [], res = []
  for (let i = 0; i < _CURRENT_IO_BUCKET.length; i++) {
    sizeMixed.push(Atomics.load(_GT_IO_STORAGE, i))
    res[i] = []
  }
  for (let i = 0; i < list.length; i++) {
    const {file, uid} = list[i]
    fileMapList[uid] = list[i]
    let index = 0
    for (let j = 1; j < sizeMixed.length; j++)
      if (sizeMixed[j] < sizeMixed[index]) index = j;
    res[index].push({file, uid})
    sizeMixed[index] += file.size
  }
  return res
}

//文件分配
const arrangeFile = (list: any[]) => {
  const res = rangeArray(list)
  let rest = list.length
  const last = Date.now()
  for (let item of workerPool) {
    const {_worker, _index, _workerId} = item
    _worker.postMessage({
      _workerId,
      _CURRENT_IO_BUCKET,
      _index,
      _GT_IO_STORAGE,
      _RUNNING_IO_STATUS,
      list: res[_index]
    })
    _worker.onmessage = (e: MessageEvent) => {
      const data = e.data
      const md5Status = data.md5Status
      switch (md5Status) {
        case 1:
          fileMapList[data.uid].md5Status = md5Status
          break
        case 2:
          fileMapList[data.uid].md5Status = md5Status
          rest--
          // console.log('thread-main', rest)
          if (rest == 0) console.log('done', (Date.now() - last) / 1000)
          break
      }
    }
  }
}
//文件改变，
const fileChange = async (event: any) => {
  demoTest.value = false
  const lists: any[] = Array.from(event.target?.files || [])
  if (lists.length == 0) return
  lists.sort((a, b) => a.size - b.size)
  for (let file of lists) {
    fileList.value.push(initFile(file))
  }
  arrangeFile(fileList.value)
  event.target.value = ''
  demoTest.value = true
}
//初始化并启动线程
const initThread = () => {
  workerPool.length = 0
  monitorPool.length = 0
  let index = 0
  while (index < workerCount + 1) {
    const url = index < workerCount ? './thread-other.ts' : './thread-monitor.ts'
    const _worker = new Worker(new URL(url, import.meta.url), {type: 'module'})
    const v = {
      _workerId: crypto.randomUUID(),
      _CURRENT_IO_BUCKET,
      _index: index,
      _GT_IO_STORAGE,
      _RUNNING_IO_STATUS,
      list: []
    }
    const c = {...v, _worker}
    index < workerCount ? workerPool.push(c) : monitorPool.push(c)
    _worker.postMessage(v)
    index++
  }
}
initThread()
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