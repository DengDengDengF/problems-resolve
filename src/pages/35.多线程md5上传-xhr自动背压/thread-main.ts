import {ref} from 'vue'

const logical = navigator.hardwareConcurrency || 3
const workerCount = Math.min(3, logical >> 1)
let taskQueue: any[] = []
const workerPool: any[] = []
const errorList = ref<any[]>([])

//终止线程以及 解决副作用
const terminate = async () => {
    workerPool.forEach(w => {
        if (w._worker) {
            //TODO 终止接口，是否调用
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
    const runTask = async (_worker: any) => {
        while (taskQueue.length > 0) {
            await new Promise((resolve, reject) => {
                const v = taskQueue.shift()
                const list = [{file: v.file, uid: v.uid}]
                _worker.postMessage({
                    list,
                    _WORKER_STATUS: 1,
                })
                _worker.onmessage = (e: MessageEvent) => {
                    const data = e.data
                    const {status, uid, md5, errorMsg} = data
                    v.status = status
                    const errorIndex = errorList.value.findIndex((v) => v.uid === uid)
                    switch (status) {
                        case 1:
                            break
                        case 2:
                            v.md5 = md5
                            if (errorIndex > -1) errorList.value.splice(errorIndex, 1)
                            resolve('')
                            break
                        case 3:
                            v.errorMsg = errorMsg
                            if (errorIndex == -1) errorList.value.push(uid)
                            resolve('')
                            break
                    }
                }
            })
        }
    }
    for (let item of workerPool)runTask(item._worker).then(()=>{})
}
//工作池中任务是否都执行完毕
const checkDone=()=>  workerPool.every((v)=>v.done)
//加入队列
const add = (list: any[]) => {
    if (!Array.isArray(list) || list.length === 0) return
    taskQueue.push(...list)
    if(!checkDone())return
    arrangeFileToWorkers()
}
//TODO 清空工作线程,任务队列，用于做测试
const clearAll = () => {
    taskQueue.length = 0
    errorList.value.length = 0
    for (let item of workerPool) {
        const {_worker} = item
        _worker.postMessage({
            _WORKER_STATUS: 3,
        })
    }
}
//批量删除工作线程任务
const batchClear = (del_list: any[]) => {
    const delSet = new Set(del_list)
    taskQueue=taskQueue.filter((v)=>!delSet.has(v.uid))
    errorList.value = errorList.value.filter(v => !delSet.has(v.uid))
    for (let item of workerPool) {
        const {_worker} = item
        _worker.postMessage({
            _WORKER_STATUS: 2,
            del_list,
        })
    }
}
//初始化并启动工作线程
const init = async () => {
    workerPool.length = 0
    for(let i=0;i < workerCount;i++){
        const path = './thread-worker.ts'
        const _worker = new Worker(new URL(path, import.meta.url), {type: 'module'})
        const v = {
            _WORKER_STATUS: 0,//0启动 1添加 2删除 3清空
            list: [],
        }
        workerPool.push({_worker,done:true})
        _worker.postMessage(v)
    }
    await Promise.resolve()
}
export {add, clearAll, batchClear, terminate, init, errorList,}