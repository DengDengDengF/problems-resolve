<template>

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
//TODO 简单测试
import {onUnmounted, ref} from 'vue'

const logical = navigator.hardwareConcurrency || 4 //逻辑核心
const workerCount = Math.max(1, logical >> 1)
// const workerCount = 1
const fileList = ref<any[]>([])
const demoTest = ref<boolean>(true)//test
const workerPool: any[] = []
const monitorPool: any[] = []
const _CURRENT_IO_BUCKET = new Int32Array(new SharedArrayBuffer(workerCount * 4))//共享线程工作桶单位字节
const _REST_IO_BUCKET = new Int32Array(new SharedArrayBuffer(workerCount * 4))//共享线程剩余桶单位字节
const _GT_IO_STORAGE = new Int32Array(new SharedArrayBuffer(workerCount * 4))//共享线程剩余没处理单位mb

const initFile = (file: File) => ({file, md5: '', errorMsg: ''})

//二次分配，确保list是排过序的，为了均匀
const rangeArray = (list: any[]) => {
  let tempStorage = [], res = []
  for (let i = 0; i < _REST_IO_BUCKET.length; i++) {
    tempStorage.push(Atomics.load(_GT_IO_STORAGE, i))
    res[i] = []
  }
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    let index = 0
    for (let j = 1; j < tempStorage.length; j++)
      if (tempStorage[j] < tempStorage[index]) index = j;
    res[index].push({file: item.file})
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
      _REST_IO_BUCKET,
      _GT_IO_STORAGE,
      list: res[_index]
    })
    _worker.onmessage = (e: MessageEvent) => {
      const data = e.data
      if (data.done) {
        rest--
        console.log('thread-main', rest)
        if (rest == 0) console.log('done', (Date.now() - last) / 1000)
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
  arrangeFile(lists)
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
      _REST_IO_BUCKET,
      _GT_IO_STORAGE,
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

</style>