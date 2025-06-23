<template>
  <div>
    <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        accept=".mp4"
        :before-upload="beforeUpload"
        :auto-upload="true"
        ref="upload"
        multiple
    >
      <div class="el-upload__text">点击文件夹 <em>点击去上传</em></div>
      <el-button slot="trigger" size="small" type="primary">选取文件夹</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
    </el-upload>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  setup() {
    const upload = ref(null);

    const beforeUpload = (file) => {
      // 自定义上传逻辑
      if(file.name.endsWith('lnk')){
          return false
      }
      console.log('Before upload:', file);
      return false; // 阻止默认上传行为
    };

    const submitUpload = async () => {
      try {
        // 请求用户选择一个目录
        const dirHandle = await window.showDirectoryPicker();
        const files = [];

        // 遍历目录中的所有文件
        for await (const entry of dirHandle.values()) {
          if (entry.kind === 'file') {
            const file = await entry.getFile();
            files.push(file);
          }
        }

        // 将文件添加到 el-upload 的文件列表中
        files.forEach((file) => {
          upload.value.addFile(file);
        });

        // 手动触发上传
        upload.value.submit();
      } catch (error) {
        console.error('Error selecting directory:', error);
      }
    };

    onMounted(() => {
      // 获取内部的 input 元素并添加 webkitdirectory 属性
      const input = upload.value.$el.querySelector('input');
      if (input) {
        input.webkitdirectory = true;
        input.multiple = true;
      }
    });

    return {
      upload,
      beforeUpload,
      submitUpload,
    };
  },
};
</script>

<style scoped>
/* 添加一些样式 */
.upload-demo {
  margin-top: 20px;
}
</style>
