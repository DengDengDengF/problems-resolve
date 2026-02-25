import {createMD5} from 'hash-wasm'

const md5HasherPromise = createMD5();
let iterationCount = 0
let fileList:any = []
let running:any = null
// const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
onmessage = async (e: MessageEvent) => {
    const {
        _workerId,
        _CURRENT_IO_BUCKET,
        _index,
        list,
        del_list,
        _GT_IO_STORAGE,
        _RUNNING_IO_STATUS,
        _WORKER_STATUS,
        _log
    } = e.data
    const MB = 1024 * 1024
    const max_chunk_size = 4 * MB
    /**从共享桶中获取余量
     * -防止cpu空转
     * -允许最小拿取
     * -这个_CURRENT_IO_BUCKET桶，监测线程也在读写*/
    const atomicSubIfEnough = (limit: number) => {
        while (true) {
            //TODO 有可能ts版本问题 报bigint
            const cur: number = Atomics.load(_CURRENT_IO_BUCKET, _index)
            if (cur === 0) {
                Atomics.wait(_CURRENT_IO_BUCKET, _index, 0)
                continue
            }
            const take = cur < limit ? cur : limit
            const next = cur - take
            const prev = Atomics.compareExchange(
                _CURRENT_IO_BUCKET,
                _index,
                cur,
                next
            )
            if (prev === cur) return take
        }
    }
    /**当前线程某任务已经算完了，削减槽中的数据
     * */
    const de = (size: number) => {
        const mb = Math.ceil(size / MB)
        const oldVal = Atomics.sub(_GT_IO_STORAGE, _index, mb)
        const newVal = oldVal - mb
        if (newVal < 0) Atomics.add(_GT_IO_STORAGE, _index, -newVal)
        // if(_log)console.log('thread-worker',_GT_IO_STORAGE)
    }
    /**计算MD5
     * -同步当前线程状态 0未工作 1工作
     * -用hash-wasm顺序算MD5,从桶当前槽中申请数据，并计算。
     * -确保当前线程剩余量正确
     * -*/
    const compute = async () => {
        if (running) return
        const md5Hasher = await md5HasherPromise
        Atomics.compareExchange(
            _RUNNING_IO_STATUS,
            _index,
            0,
            1
        )
        while (fileList.length > 0) {
            const item = fileList.shift()
            running = item
            const uid = item.uid
            const file = item.file
            const size = file.size
            let offset = 0
            let chunk_size = 0
            md5Hasher.init()
            if (!item.aborted) {
                postMessage({
                    md5Status: 1,
                    uid
                })
            }
            while (offset < size) {
                if (item.aborted) break
                try{
                    chunk_size = atomicSubIfEnough(Math.min(size - offset, max_chunk_size))
                    const slice = file.slice(offset, offset + chunk_size)
                    let buffer = await slice.arrayBuffer()
                    //TODO 可在此处加定时器，模拟地设备情况。
                    md5Hasher.update(new Uint8Array(buffer))
                    offset += chunk_size
                    buffer = null
                    if (iterationCount++ % 4 === 0) await Promise.resolve()
                }catch(errorMsg){
                    postMessage({
                        md5Status: 3,
                        uid,
                        errorMsg
                    })
                    break
                }
            }
            // if(_log)console.log(`thread${_index}-${file.name}`, 'done')
            de(size)
            if (!item.aborted && offset >= size) {
                postMessage({
                    md5Status: 2,
                    uid,
                    md5: md5Hasher.digest()
                })
            }
        }
        Atomics.compareExchange(
            _RUNNING_IO_STATUS,
            _index,
            1,
            0
        )
        running = null
    }
    /**当前线程加入要处理的MB,只能操作自己的槽
     * -确保主线程能知道每个线程正在处理的数据规模
     * -开始计算*/
    const add = async () => {
        if (!list?.length) return
        let sum = 0
        for (let item of list) {
            fileList.push(item)
            sum += item.file.size
        }
        Atomics.add(_GT_IO_STORAGE, _index, Math.ceil(sum / MB))
        await compute()
    }
    /*批量删除
    * -针对正在运行 以及 未运行的数据
    * -原子修改走computed逻辑
    * */
    const del = () => {
        if (!del_list?.length) return
        const set = new Set(del_list)
        for (let item of fileList) {
            if (set.has(item.uid)) {
                item.aborted = true
            }
        }
        if (running && set.has(running.uid)) running.aborted = true
    }
    /**清空
     * -根批量删除逻辑类似
     * -考虑到时差、二次添加.....统统走computed逻辑*/
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