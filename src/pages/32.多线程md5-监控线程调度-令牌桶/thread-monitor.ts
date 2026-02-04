onmessage = (e: MessageEvent) => {
    const {_workerId, _CURRENT_IO_BUCKET, _RUNNING_IO_STATUS} = e.data
    const MB = 1024 * 1024
    const interval = 1000
    /**
     * 50gb测试：
     * 1:
     * */
    const Limit_hash = {
        0: 0,
        1: 280 * MB,
        2: 420 * MB,
        3: 360 * MB,
        4: 420 * MB,
        5: 480 * MB,
        6: 540 * MB,
        7: 600 * MB,
        8: 660 * MB,
        9: 730 * MB,
        10: 800 * MB,
    }
    const MAX_SPEED = Limit_hash[_CURRENT_IO_BUCKET.length] ||  Limit_hash[10]
    const MIN_SPEED = Limit_hash[1]
    let bucket_index = [], bucket_index_not = []
    let now_speed = MIN_SPEED
    /**
     * 非对称控制吞吐调度器
     * -观察上次跑剩下的数据
     * -防止在线程任务不跑的情况下运行
     * -期望维持5%剩余率。低于，就加速。高于，就减速
     * -离着max_speed越近，加速就越慢。
     * -边界判断必须在[MIN_SPEED,MAX_SPEED]范围内*/
    const tuneSpeed = () => {
        if (bucket_index.length === 0) return
        const totalAllocated = now_speed
        const costTotal: number = _CURRENT_IO_BUCKET.reduce((sum: any, _: any, i: number) =>
            sum + Atomics.load(_CURRENT_IO_BUCKET, i), 0)
        const remainingRate = costTotal / totalAllocated;//剩余率
        const TARGET_REMAINING = 0.05;//期望维持5%剩余率
        const diff = TARGET_REMAINING - remainingRate;
        const accelerate_sensor = 0.15 //加速灵敏度
        const slow_sensor = 0.2//减速灵敏度
        //证明过程可以看同级目录下prove.md,可以使得
        if (diff > 0) {
            const boost = (MAX_SPEED - now_speed) * accelerate_sensor;
            now_speed += boost;
        } else {
            now_speed += now_speed * diff * slow_sensor;
        }
        now_speed = Math.max(MIN_SPEED, Math.min(MAX_SPEED, now_speed));
        // const arr = []
        // for (let i = 0; i < _CURRENT_IO_BUCKET.length; i++) {
        //     arr.push(_CURRENT_IO_BUCKET[i] / MB + 'MB')
        // }
        // console.log('thread-monitor', arr)
        // console.log('thread-monitor-rate = ', remainingRate, ' now_speed = ', now_speed / MB)
    }
    /**令牌桶分配数据
     * -只能在线程任务跑的槽分配数据
     * -数据分配均匀
     * -秒级调整
     * -其他线程，均从自己的槽中取数据，低争抢
     * */
    const tuneBucket = () => {
        bucket_index.length = 0
        bucket_index_not.length = 0
        for (let i = 0; i < _RUNNING_IO_STATUS.length; i++) {
            const expected: number = Atomics.load(_RUNNING_IO_STATUS, i)
            if (expected === 1) {
                bucket_index.push(i)
            } else {
                bucket_index_not.push(i)
            }
        }
        const eachOne = Math.ceil(now_speed / bucket_index.length)
        for (let index of bucket_index) {
            Atomics.store(_CURRENT_IO_BUCKET, index, eachOne)
            Atomics.notify(_CURRENT_IO_BUCKET, index)
        }
        for (let index of bucket_index_not) {
            Atomics.store(_CURRENT_IO_BUCKET, index, 0)
            Atomics.notify(_CURRENT_IO_BUCKET, index)
        }
    }
    setInterval(() => {
        tuneSpeed()
        tuneBucket()
        // console.log(_RUNNING_IO_STATUS)
    }, interval)
}