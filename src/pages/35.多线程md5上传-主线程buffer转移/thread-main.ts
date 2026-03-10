import {ref} from 'vue'

const logical = navigator.hardwareConcurrency || 3
const workerCount = Math.min(1, logical >> 1)
let taskQueue: any[] = []
const workerPool: any[] = []
const errorList = ref<any[]>([])
const mb = 1024 * 1024
const chunk_size = 8 * mb

//终止线程以及 解决副作用
const terminate = async () => {
    workerPool.forEach(w => {
        if (w._worker) {
            w._worker.terminate()
            w._worker = null
        }
    })
    taskQueue.length = 0
    workerPool.length = 0
    errorList.value.length = 0
    await Promise.resolve()//热更新兼容,保证顺序可预测
}

//分配文件去并行计算以及上传
const arrangeFileToWorkers = () => {
    const runTask = async (_worker: Worker) => {
        // 每次等待 worker 回一条消息
        const waitForWorker = () => new Promise<string>((res) => {
            const handler = (e: MessageEvent) => {
                _worker.removeEventListener('message', handler)
                res(e.data)
            }
            _worker.addEventListener('message', handler)
        })

        while (taskQueue.length > 0) {
            const task = taskQueue.shift()
            if (!task) break
            const file = task.file
            const size = file.size
            let offset = 0

            // 把 File 引用传给 worker，worker 自己负责 slice + stream 读取
            _worker.postMessage({type: 'init', file})
            await waitForWorker() // 'initialized'

            while (offset < size) {
                const start = offset
                const end = Math.min(offset + chunk_size, size)
                // 主线程和 worker 线程并行：
                //   worker: file.slice(start, end).stream() → 读取 → spark.append → 'append'
                //   主线程: setTimeout(270ms) 模拟上传
                _worker.postMessage({type: 'slice', start, end})
                await Promise.all([
                    waitForWorker(),                              // worker 线程 stream 读取 + md5 计算
                    new Promise((res) => setTimeout(res, 0))   // 主线程 模拟上传
                ])
                offset += chunk_size
            }

            _worker.postMessage('end')
            task.md5 = await waitForWorker()
            console.log('done', file.name)
        }
    }

    // 启动所有 Worker
    for (const item of workerPool) {
        runTask(item._worker).then(() => {
            console.log('Worker 处理完任务队列')
        })
    }
}

//工作池中任务是否都执行完毕
const checkDone = () => workerPool.every((v) => v.done)

//加入队列
const add = (list: any[]) => {
    if (!Array.isArray(list) || list.length === 0) return
    taskQueue.push(...list)
    if (!checkDone()) return
    arrangeFileToWorkers()
}

//TODO 清空工作线程,任务队列，用于做测试
const clearAll = () => {
    taskQueue.length = 0
    errorList.value.length = 0
}

//批量删除工作线程任务
const batchClear = (del_list: any[]) => {
    const delSet = new Set(del_list)
    taskQueue = taskQueue.filter((v) => !delSet.has(v.uid))
    errorList.value = errorList.value.filter(v => !delSet.has(v.uid))
}

//初始化并启动工作线程
const init = async () => {
    workerPool.length = 0
    for (let i = 0; i < workerCount; i++) {
        const path = './thread-worker.ts'
        const _worker = new Worker(new URL(path, import.meta.url), {type: 'module'})
        workerPool.push({_worker, done: true})
    }
    await Promise.resolve()
}

export {add, clearAll, batchClear, terminate, init, errorList,}
