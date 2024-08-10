<template>
  <div>
    <input type="file" ref="fileEle">
    <input type="button" @click="uploadFile" value="上传">
    <input type="button" @click="continueUpload" value="继续上传">
  </div>
</template>


<script>
import '../../utils/spark-md5.js';
import {ref} from "vue";
import Dialog from '../../utils/Dialog.js'

export default {
  name: "FileSplit",
  setup(props) {
    // 获取文件域
    const fileEle = ref(null);
    // 使用单独常量保存预设切片大小 1MB
    const chunkSize = 1024 * 1024 * 1;
    // 存储当前文件所有切片
    let chunks = [];
    // 文件hash值
    let fileHash = "";
    // 文件名
    let fileName = "";

    //获取文件hash
    const getHash = (file) => {
      return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);
        fileReader.onload = function (e) {
          let fileMd5 = SparkMD5.ArrayBuffer.hash(e.target.result);
          resolve(fileMd5);
        }
      });
    }
    // 文件切片
    const createChunks = (file) => {
      // 接受一个文件对象，要把这个文件对象切片，返回一个切片数组
      const chunks = [];
      // 文件大小.slice(开始位置,结束位置)
      let start = 0;
      let index = 0;
      while (start < file.size) {
        let curChunk = file.slice(start, start + chunkSize);
        chunks.push({
          file: curChunk,
          uploaded: false,
          fileHash: fileHash,
          chunkIndex: index,
        });
        index++;
        start += chunkSize;
      }
      return chunks;
    }

    // 单个文件上传
    const uploadHandler = (chunk) => {
      return new Promise(async (resolve, reject) => {
        try {
          let fd = new FormData();
          fd.append('file', chunk.file);
          fd.append('fileHash', chunk.fileHash);
          fd.append('chunkIndex', chunk.chunkIndex);

          // let result = await fetch('http://localhost:3000/upload', {
          //   method: 'POST',
          //   body: fd
          // }).then(res => res.json());

          let result = new Promise((res, rej) => {
            res('单次文件上传成功');
          })
          chunk.uploaded = true;
          resolve(result)
        } catch (err) {
          reject(err)
        }
      })
    }

    // 批量上传切片
    const uploadChunks = (chunks, maxRequest = 6) => {
      return new Promise((resolve, reject) => {
        if (chunks.length == 0) {
          resolve([]);
        }
        let requestSliceArr = []
        let start = 0;
        while (start < chunks.length) {
          requestSliceArr.push(chunks.slice(start, start + maxRequest))
          start += maxRequest;
        }
        let index = 0;
        let requestReaults = [];
        let requestErrReaults = [];

        const request = async () => {
          if (index > requestSliceArr.length - 1) {
            resolve(requestReaults)
            return;
          }
          let sliceChunks = requestSliceArr[index];
          Promise.all(
              sliceChunks.map(chunk => uploadHandler(chunk))
          ).then((res) => {
            requestReaults.push(...(Array.isArray(res) ? res : []))
            index++;
            request()
          }).catch((err) => {
            requestErrReaults.push(...(Array.isArray(err) ? err : []))
            reject(requestErrReaults)
          })
        }
        request()
      })
    }

    // 合并分片请求
    const mergeRequest = (fileHash, fileName) => {
      // return fetch(`http://localhost:3000/merge?fileHash=${fileHash}&fileName=${fileName}`, {
      //   method: "GET",
      // }).then(res => res.json());
      return new Promise((res, rej) => {
        res('合并成功')
      })
    };

    // 文件上传
    const uploadFile = async () => {
      let file = fileEle.value.files[0];
      if (!file) {
        Dialog('请先上传文件', {title: '提示'});
        return
      }
      // 设置文件名
      fileName = file.name;
      // 获取文件hash值
      fileHash = await getHash(file);
      // 获取切片
      chunks = createChunks(file);
      try {
        await uploadChunks(chunks)
        await mergeRequest(fileHash, fileName)
        Dialog('文件上传成功', {title: '提示'});

      } catch (err) {
        return {
          mag: "文件上传错误",
          success: false
        }
      }
    }
    // 文件续传
    const continueUpload = async () => {
      let file = fileEle.value.files[0];
      if (!file) {
        Dialog('请先上传文件', {title: '提示'});
        return
      }
      if (chunks.length == 0 || !fileHash || !fileName) {
        return;
      }
      try {
        await uploadChunks(chunks.filter(chunk => !chunk.uploaded))
        await mergeRequest(fileHash, fileName)
        Dialog('文件合并成功', {title: '提示'});
      } catch (err) {
        return {
          mag: "文件上传错误",
          success: false
        }
      }
    }

    return {fileEle, uploadFile, continueUpload}
  }
}
</script>


<style scoped>

</style>
