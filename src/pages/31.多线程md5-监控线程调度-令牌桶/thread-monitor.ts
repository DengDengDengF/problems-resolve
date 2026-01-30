onmessage = (e: MessageEvent) => {
    //TODO 剩余槽 反比的幂 二次分配，
    const {_workerId, _CURRENT_IO_BUCKET,_REST_IO_BUCKET} = e.data
    const MB = 1024 * 1024
    const interval = 1000
    let av_target = 600*MB
    const length = _CURRENT_IO_BUCKET.length
    setInterval(()=>{
        const eachOne = Math.ceil(av_target * 1.08 / _CURRENT_IO_BUCKET.length)
        const arr = []
        for(let i=0;i< _CURRENT_IO_BUCKET.length;i++){
            arr.push(_CURRENT_IO_BUCKET[i])
        }
        console.log('thread-monitor',arr)
        for (let i = 0; i < _CURRENT_IO_BUCKET.length; i++) {
            Atomics.store(_CURRENT_IO_BUCKET, i, eachOne)
            Atomics.notify(_CURRENT_IO_BUCKET, i)
        }
    },interval)
}