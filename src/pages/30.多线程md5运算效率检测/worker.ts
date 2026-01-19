/**
 * 浏览器端 MD5 多线程计算（带自适应磁盘 I/O 限速）
 * 设计目标：
 * - 以确定性方式计算 MD5（结果与全量顺序读取一致）
 * - 在大文件哈希过程中避免打满用户磁盘 I/O
 * - 通过动态 sleep 将磁盘吞吐稳定在 TARGET_MBPS 附近
 * - 保证运行稳定（不抖动）、对浏览器友好、可安全中断
 *
 * 实现策略：
 * - 按固定大小分片顺序读取文件
 * - 在时间窗口内统计真实磁盘读取速率
 * - 使用 EWMA（指数加权平均）平滑瞬时波动
 * - 通过负反馈控制动态调整分片之间的 sleep 时间
 */
import SparkMD5 from 'spark-md5'

const CHUNK_SIZE = 3 * 1024 * 1024//每一片大小
const TARGET_MBPS = 400
const TARGET_BPS = TARGET_MBPS * 1024 * 1024 //目标磁盘速率
const EWMA_ALPHA = 0.2//平滑权重。越大，响应越快但越不稳；越小，越稳但响应慢
const MIN_SLEEP = 40//最小间隔去算下一块。
const MAX_SLEEP = 80//最大间隔去算下一块。
const ADJUST_INTERVAL = 300//多久调整调整下一次磁盘读取限速/提速
const BRAKE_SPEED=25//超速后刹车灵敏度
const ACCELERATE_SPEED=5//跑满了，加速的保守灵敏度

//延迟，单位(ms)
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
onmessage = async (e: MessageEvent) => {
    const file: File = e.data.file
    if (!file) {
        postMessage({error: 'Worker: 未接收到文件'})
        return
    }
    try {
        const spark = new SparkMD5.ArrayBuffer()
        let offset = 0

        let lastNotify = 0//指定间隔内postMessage同步进度
        let sleepTime = 20//MD5.append下一片的间隔时间，会动态调整
        let avgBps = 0//当前磁盘速率
        let windowBytes = 0//ADJUST_INTERVAL内的磁盘吞吐
        let windowStart = performance.now()

        while (offset < file.size) {
            const slice = file.slice(offset, offset + CHUNK_SIZE)
            const buffer = await slice.arrayBuffer()
            spark.append(buffer)
            offset += buffer.byteLength
            windowBytes += buffer.byteLength
            if (Date.now() - lastNotify > 200) {
                postMessage({progress: Math.min(1, offset / file.size)})
                lastNotify = Date.now()
            }
           /**
            * 动态限速控制（核心逻辑）===
            * -基于最近一段时间内的实际读取速率，
            * -使用 EWMA（指数加权平均）平滑瞬时波动，
            * -通过调节 sleepTime 来逼近目标磁盘吞吐 TARGET_BPS
            * */
            const now = performance.now()
            const elapsed = now - windowStart
            // 每 ADJUST_INTERVAL ms 才进行一次调节，避免频繁抖动
            if (elapsed >= ADJUST_INTERVAL) {
                const instantBps = windowBytes / (elapsed / 1000)// 当前窗口内的瞬时磁盘吞吐（bytes / second）
                /**
                 *EWMA 平滑：
                 * - 避免因某一次 slice.arrayBuffer() 抖动导致 sleepTime 剧烈变化
                 * - alpha 越大，响应越快但越不稳；越小，越稳但响应慢
                 * -新的平均速度 = 80% 过去 + 20% 现在
                 * */
                avgBps = avgBps
                    ? avgBps * (1 - EWMA_ALPHA) + instantBps * EWMA_ALPHA
                    : instantBps
                const ratio = avgBps / TARGET_BPS   // 当前速率相对于目标速率的比例
                if (ratio > 1.05) {
                    /**
                     *实际读取速度明显高于目标：
                     *-通过增加 sleepTime 主动“让出磁盘”
                     *-增量与超出比例相关，但有 MAX_SLEEP 上限
                     *-增量 =  超速比例 * 刹车灵敏度*/
                    sleepTime = Math.min(
                        MAX_SLEEP,
                        sleepTime + Math.ceil((ratio - 1) * BRAKE_SPEED)
                    )
                } else if (ratio < 0.9) {
                    /**
                     *实际读取速度低于目标：
                     *-说明磁盘/系统当前有余量，可以适当降低 sleep
                     *-但不低于 MIN_SLEEP，避免重新打满磁盘
                     *-减量 = 加速的保守灵敏度*/
                    sleepTime = Math.max(
                        MIN_SLEEP,
                        sleepTime - ACCELERATE_SPEED
                    )
                }
                windowBytes = 0
                windowStart = now
                //调试用
                // postMessage({debugMessage:`当前磁盘读取速率${avgBps}`})
            }
            if (sleepTime > 0) {
                await sleep(sleepTime)
            }
        }
        const md5 = spark.end()
        postMessage({md5, done: true})
    } catch (err) {
        postMessage({error: (err as Error).message})
    }
}
