import  '../spark-md5.js'  //我自己项目引入的

/**
 * @param {number} chunkSize 一片多大
 * @param {File} file 文件对象
 * @return {Array} 包含对象下标的Json对象数组*/
export function computedChunk(chunkSize=50,file){
    const chunksArr = [];
    if(chunkSize < file.size) return chunksArr
    const totalChunks = Math.ceil(file.size / chunkSize);
    for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const size = end - start;
        chunksArr.push({
            index: i,
            start,
            end,
            size,
        });
    }
    return chunksArr
}

/**
 * @param {number} limitMd5Size  截取md5的长度
 * @param {File} file 文件对象
 * @return {Promise<string>} 返回 MD5 哈希值*/
export async function  computedMd5(limitMd5Size,file){
    const fileSize = file.size;
    const effectiveLimit = Math.min(limitMd5Size, fileSize);
    const firstSlice = file.slice(0, effectiveLimit);
    const endSlice = file.slice(fileSize - effectiveLimit, fileSize);
    const sizeBuffer = new ArrayBuffer(8); // 使用 8 字节存储文件大小（64 位整数）
    const sizeView = new DataView(sizeBuffer);
    sizeView.setBigUint64(0, BigInt(fileSize), true); // 以小端序存储文件大小
    const spark = new SparkMD5.ArrayBuffer();
    try {
        for (const data of [firstSlice, endSlice, sizeBuffer]) {
            const arrayBuffer = data instanceof Blob ? await data.arrayBuffer() : data;
            spark.append(arrayBuffer);
        }
        return spark.end();
    } catch (error) {
        throw new Error(`计算 MD5 失败: ${error.message}`);
    }
}

/**大文件分片并发
 * @param {number} max 最大并发
 * @param {Object} fileObject 封装的自定义的各种据 以及 文件对象
 * @return */
export async function  concurrencyRequest(max=5,fileObject={}){
    let taskList= fileObject.chunkList
    const file=fileObject.file
    let chunkSuccess=fileObject.chunkSuccess
    let chunkError=fileObject.chunkError
    const url=fileObject.url
    const md5=fileObject.md5
    const requestUrl=fileObject.requestUrl
    const header=fileObject.headers
    let isContinue=true

    /**
     * 根据是否继续上传，处理成功数组/失败数组
     * @param {number} code  后端返回的状态码
     * @param {number} currentIndex  当前正在上传的下标
     * @return {Boolean} 是否继续上传 true继续，false暂停*/
    function isToContinue(code,currentIndex){
        if(code === 0){//后台 “没报错”，文件已经上传完成
            chunkSuccess=taskList.map((item,index)=>index)
            chunkError=[]
            return false
        }else if(code === 1){//后台 “没报错”， 表示（比如：权限不足，空间不足等），可以终止上传
           while(currentIndex < taskList.length){
               chunkError.push(currentIndex)
               currentIndex++
           }
            return false
        }else if(code === 12){//后台 “没报错”，需要从第一个分片重新开始
            chunkError=taskList.map((item,index)=>index)
            chunkSuccess=[]
            return false
        }else if (code === 100){//后台 “没报错”，当前分片上传成功，还有分片没有传，继续传下一个分片
            chunkSuccess.push(currentIndex)
            return true
        }else{//后台报错了
            while(currentIndex < taskList.length){
                chunkError.push(currentIndex)
                currentIndex++
            }
            return false
        }
    }

    //执行函数
    function run(){
        const length = taskList.length;
        if (!length || !isContinue) return
        const min = Math.min(length,max)
        for (let i = 0; i < min; i++) {
            max--
            const {index,start,end,size} = taskList.shift();
            //假设是调接口的函数
            const task=()=>{}
            const formData= new FormData()
            formData.append('file', file.slice(start,end))
            formData.append('url', url)
            formData.append('chunk_index', index + 1)
            formData.append('total_chunks', taskList.length)
            formData.append('md5', md5)
            task(requestUrl,formData,{header}).then(res => {
                isContinue=isToContinue(res.data.code,index)
                if(res.data.code === 12){
                    const nextChunk = res.data.data?.chunk_index
                    if(index + 2 < parseInt(nextChunk)){
                         let start=index
                         while(start + 1 !== parseInt(nextChunk - 1)){ //兼容并发队列
                             taskList.shift()
                             start++
                         }
                    }
                }
            }).catch(error => {
                isContinue=isToContinue(error.data.code,index)
            }).finally(() => {
                max++;
                run();
            })
        }
    }
    run()
}


/**
 * 小文件上传
 * @param {Object} fileObject 封装的自定义的各种据 以及 文件对象
 * @return
 * */
export async function normalRequest(fileObject={}){
    const requestUrl=fileObject.requestUrl
    const file=fileObject.file
    const header=fileObject.headers
    let chunkSuccess=fileObject.chunkSuccess
    let chunkError=fileObject.chunkError
    let task=()=>{}
    task(requestUrl,file,{header}).then(()=>{
        chunkSuccess=[-1]
        chunkError=[]
    }).catch(()=>{
        chunkError=[-1]
        chunkSuccess=[]
    })
}