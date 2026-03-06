import SparkMD5 from  'spark-md5';
const spark = new SparkMD5.ArrayBuffer()
onmessage = async (e: MessageEvent)=>{
    if(e.data === 'end'){
        postMessage(spark.end())
    }else if(e.data === 'init'){
        spark.reset()
        postMessage('initialized')
    }else{
        spark.append(e.data)
        postMessage("append")
    }
}