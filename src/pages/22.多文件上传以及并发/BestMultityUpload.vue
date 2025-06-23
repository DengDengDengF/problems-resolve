<template>
  <input type="file" @change="fileChange" ref="uploadRef" webkitdirectory multiple>
  <template v-if="fileList.length">
    <div v-for="(item,index) in fileList" style="display: flex;justify-content: space-between">
      <div> {{ item.file.name }}</div>
      <div>上传失败</div>
    </div>
  </template>
</template>

<script setup>
import {ref} from 'vue'
import {computedChunk,concurrencyRequest,computedMd5,normalRequest} from '../../utils/uploadFunc/uploadFunc.js'

const uploadRef = ref()
const fileList = ref([])
const MAX_PIECE_CHUNK = 50 * 1024 * 1024 //每一片大小
const MAX_CONCURRENCY = 5 //最大并发 5
const LIMIT_MD5_SIZE=256 * 1024//md5截取计算

//文件改变
const fileChange = (event) => {
  fileList.value = []
  const lists = Array.from(event.target.files);
  for (let file of lists) {
    if (
        file.type !== 'video/mp4' &&
        file.type !== 'video/x-matroska' &&
        file.type !== 'video/quicktime' &&
        file.type !== 'video/webm' &&
        file.type !== 'video/x-flv' &&
        file.type !== 'video/x-f4v' &&
        file.type !== 'video/mpeg' &&
        file.type !== 'video/video/x-msvideo'
    ) {
      continue
    }
    let fileParams = {
      file,
      chunkList: computedChunk(MAX_PIECE_CHUNK, file),
      chunkSuccess: [],
      chunkError: [],
      url:'xxxxxx',
      md5:computedMd5(LIMIT_MD5_SIZE,file),
      requestUrl:'',
      headers:{}
    }
    fileList.value.push(fileParams)
  }
  if(fileList.value.length > 0) fileUpload()
}

//文件是否上传过
const requestIsDuplicated=()=>{
  return new Promise(async (resolve, reject) =>{
        let task=async()=>{}
        let res= await task()
        //第一次上传
        if(res.data.state === 2){
          resolve(0)
        }else{//不是第一次上传
          resolve(1)
        }
  })
}

//文件上传
const fileUpload=async()=>{
   for(let item of fileList.value){
     requestIsDuplicated().then(async(res)=>{
       if(res === 0){
         //大文件，单个文件支持并发+分片+节省内存
         item.file.size >MAX_PIECE_CHUNK ? await concurrencyRequest(MAX_CONCURRENCY,item) : await normalRequest(item)
       }else{
        if(item.file.size >MAX_PIECE_CHUNK){
          item.chunkSuccess=item.chunkList.map((item,index)=>index)
          item.chunkError=[]
        }else{
          item.chunkSuccess=[-1]
          item.chunkError=[]
        }
       }
     })
   }
}

</script>

<style scoped>

</style>