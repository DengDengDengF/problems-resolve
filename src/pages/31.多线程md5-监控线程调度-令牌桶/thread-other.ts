import {createMD5} from 'hash-wasm'
onmessage = async (e: MessageEvent) => {
    const {_workerId, _CURRENT_IO_BUCKET, _index, list, _GT_IO_STORAGE,_RUNNING_IO_STATUS} = e.data
    if (list.length == 0) return
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
    /**当前线程加入要处理的MB,只能操作自己的槽
     * -确保主线程能知道每个线程正在处理的数据规模*/
    const add = () => {
        const sum = list.reduce((acc: any, item: any) => acc + item.file.size, 0)
        Atomics.add(_GT_IO_STORAGE, _index, Math.ceil(sum / MB))
    }
    /**当前线程某任务已经算完了，削减槽中的数据
     * */
    const de = (size: number) => {
        const mb = Math.ceil(size / MB)
        const oldVal = Atomics.sub(_GT_IO_STORAGE, _index, mb)
        const newVal = oldVal - mb
        if (newVal < 0) Atomics.add(_GT_IO_STORAGE, _index, -newVal)
        // console.log('thread-other',_GT_IO_STORAGE)
    }
    /**计算MD5
     * -同步当前线程状态 0未工作 1工作
     * -用hash-wasm顺序算MD5,从桶当前槽中申请数据，并计算。
     * -确保当前线程剩余量正确
     * -*/
    const compute = async () => {
        Atomics.compareExchange(
            _RUNNING_IO_STATUS,
            _index,
            0,
            1
        )
        for (let i = 0; i < list.length; i++) {
            const item = list[i]
            const file = item.file
            const size =file.size
            const md5Hasher = await createMD5()
            let offset = 0
            let chunk_size = 0
            while (offset < size) {
                chunk_size = atomicSubIfEnough(Math.min(size - offset, max_chunk_size))
                const slice = file.slice(offset, offset + chunk_size)
                let buffer = await slice.arrayBuffer()
                //TODO 可在此处加定时器，模拟地设备情况。
                md5Hasher.update(new Uint8Array(buffer))
                offset += chunk_size
                buffer = null
            }
            // console.log(`thread${_index}-${file.name}`, 'done')
            de(size)
            postMessage({
                done: true
            })
        }
        Atomics.compareExchange(
            _RUNNING_IO_STATUS,
            _index,
            1,
            0
        )
    }
    add()
    await compute()
}