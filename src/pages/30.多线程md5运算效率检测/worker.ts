/**
 * 浏览器端 MD5 多线程计算（带自适应磁盘 I/O 限速）
 * 设计目标：
 * - 以确定性方式计算 MD5（结果与全量顺序读取一致）
 * - 在大文件哈希过程中避免打满用户磁盘 I/O
 * - 通过动态 sleep 将磁盘吞吐稳定在 TARGET_BPS 附近
 * - 保证运行稳定（不抖动）、对浏览器友好、可安全中断
 *
 * 实现策略：
 * - 按固定大小分片顺序读取文件
 * - 在时间窗口内统计真实磁盘读取速率
 * - 使用 EWMA（指数加权平均）平滑瞬时波动
 * - 通过负反馈控制动态调整分片之间的 sleep 时间 以及 上下限，动态调整目标磁盘速率,动态调整。
 */
import SparkMD5 from 'spark-md5'

const CHUNK_SIZE = 2 * 1024 * 1024 // 每片大小
let TARGET_BPS = 200 * 1024 * 1024 // 初始目标磁盘吞吐,后续动态调整
const TARGET_MBPS_MAX = 600 // 最大目标吞吐
const TARGET_MBPS_MIN = 80  // 最小目标吞吐
const EWMA_ALPHA = 0.15 // 平滑权重
const ADJUST_INTERVAL = 800 // ms，多久调整一次吞吐
const BRAKE_SPEED = 30       // 超速刹车灵敏度
const ACCELERATE_SPEED = 4   // 加速保守灵敏度
const MIN_FLOOR = 30         // sleep 下限
const MAX_CEIL = 180         // sleep 上限

// 延迟
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms))
//根据 chunkSize 与目标吞吐估算 sleep 区间
const calcSleepRange = ({chunkSize, targetBps, minFloor = MIN_FLOOR, maxCeil = MAX_CEIL}) => {
    const idealChunkTime = (chunkSize / targetBps) * 1000
    const minSleep = Math.max(minFloor, Math.floor(idealChunkTime * 0.85))
    const maxSleep = Math.max(Math.min(maxCeil, Math.ceil(idealChunkTime * 1.8)),minSleep)
    return {minSleep, maxSleep, idealChunkTime}
}
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
        let avgBps = 0//当前磁盘速率
        let windowBytes = 0//ADJUST_INTERVAL内的磁盘吞吐
        let windowStart = performance.now()
        let {minSleep: DYN_MIN_SLEEP, maxSleep: DYN_MAX_SLEEP} = calcSleepRange({
            chunkSize: CHUNK_SIZE,
            targetBps: TARGET_BPS
        }) // 初始动态 sleep 区间
        let sleepTime = DYN_MIN_SLEEP//MD5.append下一片的间隔时间，会动态调整

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
            if (elapsed >= ADJUST_INTERVAL) {
                const instantBps = windowBytes / (elapsed / 1000)
                /**
                 *EWMA 平滑：
                 * - 避免因某一次 slice.arrayBuffer() 抖动导致 sleepTime 剧烈变化
                 * - alpha 越大，响应越快但越不稳；越小，越稳但响应慢
                 * -新的平均速度 = 80% 过去 + 20% 现在
                 * */
                avgBps = avgBps
                    ? avgBps * (1 - EWMA_ALPHA) + instantBps * EWMA_ALPHA
                    : instantBps

                const ratio = avgBps / TARGET_BPS

                // 调整 sleepTime
                if (ratio > 1.05) {
                    /**
                     *实际读取速度明显高于目标：
                     *-通过增加 sleepTime 主动“让出磁盘”
                     *-增量与超出比例相关，但有 MAX_SLEEP 上限
                     *-增量 =  超速比例 * 刹车灵敏度*/
                    sleepTime = Math.min(DYN_MAX_SLEEP, sleepTime + Math.ceil((ratio - 1) * BRAKE_SPEED))
                } else if (ratio < 0.9) {
                    /**
                     *实际读取速度低于目标：
                     *-说明磁盘/系统当前有余量，可以适当降低 sleep
                     *-但不低于 MIN_SLEEP，避免重新打满磁盘
                     *-减量 = 加速的保守灵敏度*/
                    sleepTime = Math.max(DYN_MIN_SLEEP, sleepTime - ACCELERATE_SPEED)
                }
                /**
                 * 动态调整目标吞吐 (自适应硬盘能力)
                 * - 实际速度 低于 目标的 80%，说明磁盘受限，降低 targetBps 10%
                 * - 实际速度 高于 目标的 110%，说明磁盘还有余量，提高 targetBps 10%
                 */
                if (avgBps < TARGET_BPS * 0.8) {
                    TARGET_BPS = Math.max(TARGET_MBPS_MIN * 1024 * 1024, TARGET_BPS * 0.9)
                } else if (avgBps > TARGET_BPS * 1.1) {
                    TARGET_BPS = Math.min(TARGET_MBPS_MAX * 1024 * 1024, TARGET_BPS * 1.1)
                }
                /**
                 *动态调整sleep区间
                 * -作用于sleepTime的增量和减量*/
                const newRange = calcSleepRange({chunkSize: CHUNK_SIZE, targetBps: TARGET_BPS})
                DYN_MIN_SLEEP = newRange.minSleep
                DYN_MAX_SLEEP = newRange.maxSleep

                windowBytes = 0
                windowStart = now
            }

            if (sleepTime > 0) await sleep(sleepTime)
        }

        const md5 = spark.end()
        postMessage({md5, done: true})
    } catch (err) {
        postMessage({error: (err as Error).message})
    }
}
