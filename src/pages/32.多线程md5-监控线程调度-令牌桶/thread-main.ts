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
 *                  | |
 *                  | |
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
import {onUnmounted} from "vue";

const logical = navigator.hardwareConcurrency || 4 //逻辑核心
const workerCount = Math.max(1, logical >> 1)//开几个工作线程
const fileRegistry = {}
let rest = 0
const workerPool: any[] = []
const monitorPool: any[] = []
const _CURRENT_IO_BUCKET = new Int32Array(new SharedArrayBuffer(workerCount * 4))//共享线程工作桶单位字节
const _GT_IO_STORAGE = new Int32Array(new SharedArrayBuffer(workerCount * 4))//共享线程剩余没处理单位mb
const _RUNNING_IO_STATUS = new Int32Array(new SharedArrayBuffer(workerCount * 4))//WORKER是否在处理任务，没在处理0，在处理1

//线程关闭
const cleanUpWorkers = () => {
    workerPool.forEach(w => {
        if (w._worker) {
            w._worker.terminate()
            w._worker = null
        }
    })
    monitorPool.forEach(w => {
        if (w._worker) {
            w._worker.terminate()
            w._worker = null
        }
    })
    workerPool.length = 0
    monitorPool.length = 0
}
//二次分配，确保list是排过序的，为了均匀
const rangeArray = (list: any[]) => {
    let sizeMixed = [], res = []
    for (let i = 0; i < _CURRENT_IO_BUCKET.length; i++) {
        sizeMixed.push(Atomics.load(_GT_IO_STORAGE, i))
        res[i] = []
    }
    for (let i = 0; i < list.length; i++) {
        const {file, uid} = list[i]
        fileRegistry[uid] = list[i]
        let index = 0
        for (let j = 1; j < sizeMixed.length; j++)
            if (sizeMixed[j] < sizeMixed[index]) index = j;
        res[index].push({file, uid})
        sizeMixed[index] += file.size
    }
    return res
}
//文件分配到工作线程
const arrangeFile = (list: any[]) => {
    const res = rangeArray(list)
    rest += list.length
    const last = Date.now()
    for (let item of workerPool) {
        const {_worker, _index, _workerId} = item
        _worker.postMessage({
            _workerId,
            _CURRENT_IO_BUCKET,
            _index,
            _GT_IO_STORAGE,
            _RUNNING_IO_STATUS,
            _WORKER_STATUS: 1,
            list: res[_index]
        })
        _worker.onmessage = (e: MessageEvent) => {
            const data = e.data
            const {md5Status, uid, md5, errorMsg} = data
            fileRegistry[uid].md5Status = md5Status
            switch (md5Status) {
                case 1:
                    break
                case 2:
                    fileRegistry[uid].md5 = md5
                    rest--
                    if (rest == 0) console.log('done', (Date.now() - last) / 1000)
                    break
                case 3:
                    fileRegistry[uid].errorMsg = errorMsg
                    rest--
                    if (rest == 0) console.log('done-but-wrong', (Date.now() - last) / 1000)
            }
        }
    }
}
//清空工作线程中任务
const clearAll = () => {
    for (let uid in fileRegistry) delete fileRegistry[uid]
    for (let item of workerPool) {
        const {_worker, _index, _workerId} = item
        _worker.postMessage({
            _workerId,
            _CURRENT_IO_BUCKET,
            _index,
            _GT_IO_STORAGE,
            _RUNNING_IO_STATUS,
            _WORKER_STATUS: 3,
        })
    }
}
//批量删除工作线程任务
const batchClear = (del_list: any[]) => {
    for (let uid of del_list) delete fileRegistry[uid]
    for (let item of workerPool) {
        const {_worker, _index, _workerId} = item
        _worker.postMessage({
            _workerId,
            _CURRENT_IO_BUCKET,
            _index,
            _GT_IO_STORAGE,
            _RUNNING_IO_STATUS,
            _WORKER_STATUS: 2,
            del_list,
        })
    }
}
//初始化并启动工作线程、监测线程
const initThread = () => {
    workerPool.length = 0
    monitorPool.length = 0
    let index = 0
    while (index < workerCount + 1) {
        const url = index < workerCount ? './thread-worker.ts' : './thread-monitor.ts'
        const _worker = new Worker(new URL(url, import.meta.url), {type: 'module'})
        const v = {
            _workerId: crypto.randomUUID(),
            _CURRENT_IO_BUCKET,
            _index: index,
            _GT_IO_STORAGE,
            _RUNNING_IO_STATUS,
            _WORKER_STATUS: 0,//0启动 1添加 2删除 3清空
            list: []
        }
        const c = {...v, _worker}
        index < workerCount ? workerPool.push(c) : monitorPool.push(c)
        _worker.postMessage(v)
        index++
    }
}
export {arrangeFile, clearAll, batchClear,cleanUpWorkers,initThread}