<template>
  <p>运算结果：{{computedRes}}</p>
  <el-scrollbar :height="500" always>
    <div v-for="item in  fileList" class="lists">
      <div class="lists-item">
        <div class="left">{{ item.file.name }}</div>
        <div class="right">
          <span>{{item.md5}}</span>
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
//TODO demo 设计思想：把cpu密集并行 和 接口并发分开。同时进行。同时磁盘速率？
import {ref} from 'vue'

const logical = navigator.hardwareConcurrency || 4 //逻辑核心
// const net = 5//网络接口同时并发5
// const workerCount = Math.min(net, Math.max(1, logical >> 1))
const workerCount = Math.max(1, logical >> 1) //真实并行
const fileList = ref<any[]>([])
let taskQueue: any[] = []
let workPool: any[] = []
const isUploaded=ref<boolean>(true)
const computedRes=ref<string>('')

const initFile = (file: File) => ({progress: '', file,md5:''})
const getSizeSum=()=>{
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
const startWorker=(item:any)=>{
  return new Promise((resolve,reject)=>{
    const file=item.file
    let worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' })
    worker.onmessage = (e: MessageEvent) => {
      const data = e.data
      if (data.progress !== undefined) {
        item.progress=(data.progress * 100).toFixed(2) + '%'
        // console.log('进度', (data.progress * 100).toFixed(2) + '%')
      }
      if (data.done) {
        item.md5=data.md5
        item.progress='100%'
        // console.log('文件 MD5:', data.md5)
        worker.terminate()
        worker=null
        resolve()
      }
    }
    worker.onerror = (e: ErrorEvent) => {
      console.error('Worker 出错:', e.message, '行号:', e.lineno, '列号:', e.colno)
      worker.terminate()
      worker=null
      reject()
    }
    worker.postMessage({status:1,file})
  })
}
const computedFile = () => {
  isUploaded.value=false
  const start = performance.now()
  computedRes.value='...'
  if (taskQueue.length == 0) {
    isUploaded.value=true
    const duration = (performance.now() - start) / 1000
    const size = getSizeSum()
    computedRes.value=fileList.value.length + '个文件,'+size+','+workerCount + '线程，执行 '+duration + ' 秒'
    return
  }
  const runTask = async () => {
    if(taskQueue.length == 0 && workPool.length == 0){
      isUploaded.value=true
      const duration = (performance.now() - start) / 1000
      const size = getSizeSum()
      computedRes.value=fileList.value.length + '个文件,'+size+','+workerCount + '线程，执行 '+duration + ' 秒'
      return
    }
    while(taskQueue.length > 0 && workPool.length < workerCount){
      const item = taskQueue.shift()
      workPool.push(item)
      try{
        await startWorker(item)
        //准备根据协议不通http1.1 5个接口并发上传
      }finally{
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
  if(fileList.value.length > 0)fileList.value.length =0
  for (let file of lists) {
    fileList.value.push(initFile(file))
    taskQueue.push(fileList.value[fileList.value.length-1])
  }
  if(isUploaded.value)computedFile()
  event.target.value = ''
}
</script>

<style scoped>
.lists {
  display: flex;
  flex-direction: column;

  .lists-item {
    display: flex;
    .left{
      width: 50%;
    }
    .right{
      width: 50%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>