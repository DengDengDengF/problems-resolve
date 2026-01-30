import {createMD5} from 'hash-wasm'

onmessage = async(e: MessageEvent) => {
    const {_workerId, _CURRENT_IO_BUCKET, _index, _REST_IO_BUCKET, list, _GT_IO_STORAGE} = e.data
    if (list.length == 0) return
    const MB = 1024 * 1024
    const max_chunk_size = 4 * MB
    //从共享桶中获取余量
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
    //当前线程加入要处理的MB,只能操作自己的槽
    const add = () => {
        const sum = list.reduce((acc:any, item:any) => acc + item.file.size, 0)
        Atomics.add(_GT_IO_STORAGE, _index, Math.ceil(sum / MB))
    }
    const compute = async() => {
        for (let i = 0; i < list.length; i++) {
            const item = list[i]
            const file = item.file
            const md5Hasher = await createMD5()
            let offset = 0
            let chunk_size = 0
            while (offset < file.size) {
                chunk_size = atomicSubIfEnough(Math.min(file.size - offset, max_chunk_size))
                const slice = file.slice(offset, offset + chunk_size)
                const buffer = await slice.arrayBuffer()
                md5Hasher.update(new Uint8Array(buffer))
                offset += chunk_size
            }
            console.log(`thread${_index}-${file.name}`, 'done')
            postMessage({
                done: true
            })
        }
    }
    add()
    await compute()
}