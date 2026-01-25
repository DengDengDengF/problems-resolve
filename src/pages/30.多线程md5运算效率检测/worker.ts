import SparkMD5 from 'spark-md5'

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
let sleepMs:number = 0, lockBoolean:boolean = false
let oldErrorMessage:string = ''
onmessage = async (e: MessageEvent) => {
    const {file, control} = e.data
    try {
        if (control.sleepMs) sleepMs = control.sleepMs
        if (control.status == 1 && lockBoolean) return
        lockBoolean = true
        if (control.status == 2) {
            postMessage({stop: true})
            lockBoolean = false
            return
        }
        if (!file) {
            postMessage({error: 'Worker: 未接收到文件'})
            lockBoolean = false
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
            if (control.status == 2) {
                postMessage({stop: true})
                lockBoolean = false
                return
            }
            const slice = file.slice(offset, offset + CHUNK_SIZE)
            //解决读取被锁的文件，直接线程停止问题。
            oldErrorMessage=''
            let timeout = setTimeout(() => {
                throw new Error(`${oldErrorMessage} _ ${file.name} 读取超时`)
            }, 5000)
            const buffer = await slice.arrayBuffer()
            clearTimeout(timeout)
            spark.append(buffer)
            offset += buffer.byteLength
            windowBytes += buffer.byteLength
            if (control.status == 2) {
                postMessage({stop: true})
                lockBoolean = false
                return
            }
            //通知主线程同步进度
            if (Date.now() - lastNotify > 200) {
                postMessage({
                    progress: Math.min(1, offset / file.size)
                })
                lastNotify = Date.now()
            }
            const now = performance.now()
            const elapsed = now - windowStart
            if (control.status == 2) {
                postMessage({stop: true})
                lockBoolean = false
                return
            }
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
        if (control.status == 2) {
            postMessage({stop: true})
            lockBoolean = false
            return
        }
        postMessage({md5, done: true})
        lockBoolean = false
    } catch (err) {
        //文件被锁的情况下，worker线程直接挂起，上面的定时器发挥作用，打印报错信息。
        oldErrorMessage =err.name + ' ' + err.message
        if (control.status == 2) {
            postMessage({stop: true})
            lockBoolean = false
            return
        }
        postMessage({error: (err as Error).message})
        lockBoolean = false
    }
}
