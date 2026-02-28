import {ref} from 'vue'

const fileRegistry: Record<string, any> = {}
const workerPool: any[] = []
const md5ErrorList = ref<any[]>([])
let rest = 0

//终止线程 以及 解决副作用
const terminateThreads = async () => {
    workerPool.forEach(w => {
        if (w._worker) {
            w._worker.terminate()
            w._worker = null
        }
    })
    for (let uid in fileRegistry) delete fileRegistry[uid]
    workerPool.length = 0
    md5ErrorList.value.length = 0
    rest = 0
    //TODO 主线程uploadLib.ts 清空
    await Promise.resolve()//热更新兼容,保证顺序可预测
}
//二次处理
const dealList=(list:any[])=>{
    const res=[]
    for (let i = 0; i < list.length; i++) {
        const {file, uid} = list[i]
        fileRegistry[uid] = list[i]
        const errorIndex = md5ErrorList.value.findIndex((v)=>v.uid === uid)
        if(errorIndex > -1){
            fileRegistry[uid].md5Status = 0
            fileRegistry[uid].md5= ''
            fileRegistry[uid].errorMsg =''
            md5ErrorList.value.splice(errorIndex, 1)
        }
        res.push({file, uid})
    }
    return res
}
//文件分配到工作线程
const arrangeFileToWorkers = (list: any[]) => {
    const res=dealList(list)
    rest += res.length
    const last = Date.now()
    for (let item of workerPool) {
        const {_worker,} = item
        _worker.postMessage({
            list: res,
            _WORKER_STATUS: 1,
        })
        _worker.onmessage = (e: MessageEvent) => {
            const data = e.data
            const {md5Status, uid, md5, errorMsg} = data
            fileRegistry[uid].md5Status = md5Status
            const errorIndex = md5ErrorList.value.findIndex((v) => v.uid === uid)
            switch (md5Status) {
                case 1:
                    break
                case 2:
                    fileRegistry[uid].md5 = md5
                    if (errorIndex > -1) md5ErrorList.value.splice(errorIndex, 1)
                    //TODO 主线程uploadLib.ts 上传
                    rest--
                    if (rest == 0) console.log('done', (Date.now() - last) / 1000)
                    break
                case 3:
                    fileRegistry[uid].errorMsg = errorMsg
                    if (errorIndex == -1) md5ErrorList.value.push(fileRegistry[uid])
                    rest--
                    if (rest == 0) console.log('done-but-wrong', (Date.now() - last) / 1000)
            }
        }
    }
}
//TODO 清空工作线程,用于做测试
const clearAllInWorkers = () => {
    for (let uid in fileRegistry) delete fileRegistry[uid]
    md5ErrorList.value.length = 0
    for (let item of workerPool) {
        const {_worker} = item
        _worker.postMessage({
            _WORKER_STATUS: 3,
        })
    }
}
//批量删除工作线程任务
const batchClearInWorkers = (del_list: any[]) => {
    for (let uid of del_list) {
        const errorIndex = md5ErrorList.value.findIndex((v) => v.uid === uid)
        if (errorIndex > -1) md5ErrorList.value.splice(errorIndex, 1)
        delete fileRegistry[uid]
    }
    for (let item of workerPool) {
        const {_worker} = item
        _worker.postMessage({
            _WORKER_STATUS: 2,
            del_list,
        })
    }
}
//初始化并启动工作线程、监测线程
const initThreads = async () => {
    workerPool.length = 0
    const path = './thread-worker-md5.ts'
    const _worker = new Worker(new URL(path, import.meta.url), {type: 'module'})
    const v = {
        _WORKER_STATUS: 0,//0启动 1添加 2删除 3清空
        list: [],
    }
    workerPool.push({_worker})
    _worker.postMessage(v)
    await Promise.resolve()
}
export {arrangeFileToWorkers, clearAllInWorkers, batchClearInWorkers, terminateThreads, initThreads, md5ErrorList}