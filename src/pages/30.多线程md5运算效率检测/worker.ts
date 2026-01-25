import SparkMD5 from 'spark-md5'

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
let sleepMs = 0
onmessage = async (e: MessageEvent) => {
    const {file, control} = e.data
    try {
        if (control.sleepMs) sleepMs = control.sleepMs
        if (control.status == 1) return
        if (control.status == 2) return postMessage({stop: true})
        if (!file) {
            postMessage({error: 'Worker: 未接收到文件'})
            return
        }
        const spark = new SparkMD5.ArrayBuffer()
        let offset = 0
        let lastNotify = 0
        let windowBytes = 0
        let windowStart = performance.now()
        const CHUNK_SIZE = control.CHUNK_SIZE || 2 * 1024 * 1024
        const ADJUST_INTERVAL = control.ADJUST_INTERVAL || 800

        while (offset < file.size) {
            if (control.status == 2) return postMessage({stop: true})
            const slice = file.slice(offset, offset + CHUNK_SIZE)
            const buffer = await slice.arrayBuffer()
            spark.append(buffer)
            offset += buffer.byteLength
            windowBytes += buffer.byteLength
            if (control.status == 2) return postMessage({stop: true})
            //通知主线程同步进度
            if (Date.now() - lastNotify > 200) {
                postMessage({
                    progress: Math.min(1, offset / file.size)
                })
                lastNotify = Date.now()
            }
            const now = performance.now()
            const elapsed = now - windowStart
            if (control.status == 2) return postMessage({stop: true})
            //通知主线程同步磁盘吞吐数据
            if (elapsed >= ADJUST_INTERVAL) {
                postMessage({
                    stat: {
                        bytes: windowBytes,
                        elapsed
                    }
                })
                windowBytes = 0
                windowStart = now
            }
            if (sleepMs > 0) {
                await sleep(sleepMs)
            }
        }
        const md5 = spark.end()
        if (control.status == 2) return postMessage({stop: true})
        postMessage({md5, done: true})
    } catch (err) {
        if (control.status == 2) return postMessage({stop: true})
        postMessage({error: (err as Error).message})
    }
}
