import {createMD5} from 'hash-wasm'

const md5HasherPromise = createMD5();
const MB = 1024 * 1024
let fileList: any = []
let running:any = null
let processedBytes = 0
onmessage = async (e: MessageEvent) => {
    const {
        list,
        del_list,
        _WORKER_STATUS
    } = e.data
    //计算
    const compute=async()=>{
        if(running) return
        const md5Hasher = await md5HasherPromise
        while(fileList.length > 0){
            const item = fileList.shift()
            const uid = item.uid
            if (!item.aborted) {
                postMessage({
                    md5Status: 1,
                    uid
                })
            }
            running=item
            const file = item.file
            md5Hasher.init()
            const stream = file.stream()
            const reader = stream.getReader()
            let fileDone=false
            try {
                while (true) {
                    if (item.aborted) break
                    const { done, value } = await reader.read()
                    if (done){
                        fileDone=true
                        break
                    }
                    if (value && value.byteLength > 0) {
                        md5Hasher.update(value)
                        processedBytes += value.byteLength
                        if (processedBytes > 32*MB) {
                            processedBytes = 0
                            await new Promise(r => setTimeout(r, 0))
                        }
                    }
                }
                if(!item.aborted && fileDone){
                    postMessage({
                        md5Status: 2,
                        uid,
                        md5: md5Hasher.digest()
                    })
                }
            }catch(errorMsg){
                postMessage({
                    md5Status: 3,
                    uid,
                    errorMsg
                })
            } finally {
                // reader.releaseLock()
                reader.cancel()
                running = null
            }
        }
    }
    //添加
    const add=async()=>{
        if (!list?.length) return
        for(let item of list)fileList.push(item)
        await compute()
    }
    //删除
    const del = ()=>{
        if (!del_list?.length) return
        const set = new Set(del_list)
        for (let item of fileList) {
            if (set.has(item.uid)) {
                item.aborted = true
            }
        }
        if (running && set.has(running.uid)) running.aborted = true
    }
    //清空
    const clear = () => {
        for (let item of fileList) item.aborted = true
        if (running) running.aborted = true
    }
    /**初始化
     * 0启动线程 1加入任务 2删除 3清空*/
    const init = () => {
        switch (_WORKER_STATUS) {
            case 0:
                break
            case 1:
                add()
                break
            case 2:
                del()
                break
            case 3:
                clear()
                break
        }
    }
    init()
}