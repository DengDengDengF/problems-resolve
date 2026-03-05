import {createMD5} from 'hash-wasm'

const md5HasherPromise = createMD5();
const MB = 1024 * 1024
const chunk_size =6 * MB
const fileList:any[]=[]
let running:any = null
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
onmessage = async (e: MessageEvent)=>{
    const {
        list,
        del_list,
        _WORKER_STATUS,
    } = e.data
    //md5计算以及上传
    const computeAndUpload=async()=>{
        if(running) return
        const md5Hasher = await md5HasherPromise
        while(fileList.length > 0){
            const item = fileList.shift()
            const uid = item.uid
            if (!item.aborted) {
                postMessage({
                    status: 1,
                    uid
                })
            }
            running=item
            const file = item.file
            md5Hasher.init()
            const stream = file.stream()
            const reader = stream.getReader()
            let fileDone=false
            let buffer = new Uint8Array(chunk_size)
            let offset = 0
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
                        let pos = 0
                        while (pos < value.byteLength) {
                            const canFit = chunk_size - offset;
                            const take = Math.min(canFit, value.byteLength - pos);
                            buffer.set(value.subarray(pos, pos + take), offset);
                            offset += take;
                            pos += take;
                            if (offset === chunk_size) {
                                /**
                                 * TODO 把充满的buffer上传
                                 * ----带开发*/
                                await sleep(40)
                                offset = 0;
                            }
                        }
                    }
                }
                if(!item.aborted && fileDone){
                    postMessage({
                        status: 2,
                        uid,
                        md5: md5Hasher.digest()
                    })
                }
            }catch(errorMsg){
                postMessage({
                    status: 3,
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
    const add = async () => {
        if (!list?.length) return
        for (let item of list){
            item.controller = new AbortController()
            fileList.push(item)
        }
        await computeAndUpload()
    }
    //删除任务
    const del=()=>{
        if (!del_list?.length) return
        const set = new Set(del_list)
        for (let item of fileList) {
            if (set.has(item.uid)){
                //TODO 考虑后续删掉
                item.aborted = true
                item.controller?.aborted?.()
            }
        }
        if (running && set.has(running.uid)) {
            running.aborted = true
            running.controller?.aborted?.()
        }
    }
    //清空
    const clear=()=>{
        for (let item of fileList){
            item.aborted = true
            item.controller?.aborted?.()
        }
        if(running){
            running.aborted = true
            running.controller?.aborted?.()
        }
    }
    /**初始化
     * 0启动线程 1执行任务 2删除任务 */
    const init=()=>{
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