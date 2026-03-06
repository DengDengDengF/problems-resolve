import {ref} from 'vue'

const logical = navigator.hardwareConcurrency || 3
const workerCount = Math.min(3, logical >> 1)
let taskQueue: any[] = []
const workerPool: any[] = []
const errorList = ref<any[]>([])
const mb = 1024 * 1024
const chunk_size = 8*mb

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
    const runTask = async (_worker: Worker) => {
        while (taskQueue.length > 0) {
            const task = taskQueue.shift();
            if (!task) break;
            const file = task.file;
            const size = file.size;
            let offset = 0;
            const toUpload=async()=>{
                console.log('file.name = ',file.name)
                 if(offset < size){
                     const slice = file.slice(offset, offset + chunk_size)
                     const buffer = await slice.arrayBuffer()
                     _worker.postMessage(buffer, [buffer])
                     await new Promise((res)=>setTimeout(()=>{res()},270))
                     offset += chunk_size
                 }else{
                     _worker.postMessage('end')
                 }
            }
            _worker.postMessage('init')
            await new Promise((res,rej)=>{
                _worker.onmessage = async(e: MessageEvent) =>{
                    const data=e.data
                    switch(data){
                        case 'initialized':
                            // console.log('initialized')
                            await toUpload()
                            break
                        case 'append':
                            // console.log('append')
                            await toUpload()
                            break
                        default:
                            task.md5=data
                            console.log('done',file.name)
                            res('')
                            _worker.onmessage = null;
                            break
                    }
                }
            })

        }
    };

    // 启动所有 Worker
    for (const item of workerPool) {
        runTask(item._worker).then(() => {
            console.log('Worker 处理完任务队列');
        });
    }
};
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
}
//批量删除工作线程任务
const batchClear = (del_list: any[]) => {
    const delSet = new Set(del_list)
    taskQueue=taskQueue.filter((v)=>!delSet.has(v.uid))
    errorList.value = errorList.value.filter(v => !delSet.has(v.uid))
}
//初始化并启动工作线程
const init = async () => {
    workerPool.length = 0
    for(let i=0;i < workerCount;i++){
        const path = './thread-worker.ts'
        const _worker = new Worker(new URL(path, import.meta.url), {type: 'module'})
        workerPool.push({_worker,done:true})
        _worker.postMessage('init')
    }
    await Promise.resolve()
}
export {add, clearAll, batchClear, terminate, init, errorList,}