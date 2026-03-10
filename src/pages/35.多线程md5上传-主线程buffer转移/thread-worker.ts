import SparkMD5 from 'spark-md5'
const spark = new SparkMD5.ArrayBuffer()
let file: File | null = null

onmessage = async (e: MessageEvent) => {
    const data = e.data
    if (data === 'end') {
        postMessage(spark.end())
    } else if (data?.type === 'init') {
        file = data.file
        spark.reset()
        postMessage('initialized')
    } else if (data?.type === 'slice') {
        const reader = file!.slice(data.start, data.end).stream().getReader()
        while (true) {
            const {done, value} = await reader.read()
            if (done) break
            spark.append(value.buffer)
        }
        postMessage('append')
    }
}
