import SparkMD5 from 'spark-md5'

const CHUNK_SIZE = 3 * 1024 * 1024
/**
 * TODO
 * 记录最近几次 slice 的 I/O 速率，用 指数加权平均 来估计当前负载
 * 根据平均速率动态调整 sleep
 * */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
onmessage = async (e: MessageEvent) => {
    const file: File = e.data.file
    if (!file) {
        postMessage({error: 'Worker: 未接收到文件'})
        return
    }
    try {
        const spark = new SparkMD5.ArrayBuffer()
        let offset = 0,lastNotify=0
        while (offset < file.size) {
            const slice = file.slice(offset, offset + CHUNK_SIZE)
            const buffer = await slice.arrayBuffer()
            spark.append(buffer)
            offset += CHUNK_SIZE
            if (Date.now() - lastNotify > 200) {
                postMessage({progress: Math.min(1, offset / file.size)})
                lastNotify = Date.now()
            }
            await  sleep(40)
        }
        const md5 = spark.end()
        postMessage({md5, done: true})
    } catch (err) {
        postMessage({error: (err as Error).message})
    }
}