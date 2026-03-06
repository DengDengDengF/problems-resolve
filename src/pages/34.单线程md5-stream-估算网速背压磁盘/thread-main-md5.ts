/**主线程ts文件，管理md5工作线程，仅涉及与md5计算相关的逻辑
 * -分配任务
 * -状态处理
 * -线程清理、初始化
 * -线程中任务终止、任务添加
 * */
import {ref} from 'vue'

const fileRegistry: Record<string, any> = {}
let _worker: any = null
const md5ErrorList = ref<any[]>([])
const md5Uncalculated = ref<number>(0)

//终止线程 以及 解决副作用
const terminateThreads = async () => {
    _worker?.terminate?.()
    _worker = null
    for (let uid in fileRegistry) delete fileRegistry[uid]
    md5ErrorList.value.length = 0
    md5Uncalculated.value = 0
    await Promise.resolve()//热更新兼容,保证顺序可预测
}
//二次处理
const dealList = (list: any[]) => {
    const res = []
    for (let i = 0; i < list.length; i++) {
        const {file, uid} = list[i]
        fileRegistry[uid] = list[i]
        const errorIndex = md5ErrorList.value.findIndex((v) => v.uid === uid)
        if (errorIndex > -1) {
            fileRegistry[uid].md5Status = 0
            fileRegistry[uid].md5 = ''
            fileRegistry[uid].errorMsg = ''
            md5ErrorList.value.splice(errorIndex, 1)
        }
        res.push({file, uid})
    }
    return res
}
//文件分配到工作线程
const arrangeFileToWorkers = (list: any[]) => {
    if (!_worker) return
    const res = dealList(list)
    md5Uncalculated.value += res.length
    const last = Date.now()
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
                md5Uncalculated.value--
                if (md5Uncalculated.value == 0) console.log('done', (Date.now() - last) / 1000)
                break
            case 3:
                fileRegistry[uid].errorMsg = errorMsg
                if (errorIndex == -1) md5ErrorList.value.push(fileRegistry[uid])
                md5Uncalculated.value--
                if (md5Uncalculated.value == 0) console.log('done-but-wrong', (Date.now() - last) / 1000)
        }
    }
}
//批量删除工作线程任务
const batchClearInWorkers = (del_list: any[]) => {
    if (!_worker) return
    for (let uid of del_list) {
        const errorIndex = md5ErrorList.value.findIndex((v) => v.uid === uid)
        if (errorIndex > -1) md5ErrorList.value.splice(errorIndex, 1)
        delete fileRegistry[uid]
    }
    _worker.postMessage({
        _WORKER_STATUS: 2,
        del_list,
    })
}
const threadSpeed = (netSpeed: number) => {
    if (!_worker) return
    _worker.postMessage({
        _WORKER_STATUS: 4,
        netSpeed
    })
}
//初始化并启动工作线程、监测线程
const initThreads = async () => {
    const path = './thread-worker-md5.ts'
    _worker = new Worker(new URL(path, import.meta.url), {type: 'module'})
    const v = {
        _WORKER_STATUS: 0,//0启动 1添加 2删除 3清空
        list: [],
    }
    _worker.postMessage(v)
    await Promise.resolve()
}
export {
    arrangeFileToWorkers,
    batchClearInWorkers,
    terminateThreads,
    initThreads,
    md5ErrorList,
    threadSpeed,
    md5Uncalculated
}