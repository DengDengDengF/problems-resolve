<template>
  <div>
    {{ data }}
    <div v-for="(item, index) in data" :key="index">
      <el-upload
          :file-list="item.fileList"
          :before-upload="(file) => handleBeforeUpload(file, item)"
          :on-remove="(file) => handleRemove(file, item)"
          action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
          :before-remove="handleBeforeRemove"
          class="upload-demo"
      >
        <el-button type="primary">Click to upload</el-button>
        <template #tip>
          <div class="el-upload__tip">
            jpg/png/pdf files with a size less than 500kb
          </div>
        </template>
      </el-upload>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// data 是包含多个上传项的数组
const data = ref([
  { fileList: [{ name: 'ss', status: 'success', uid: Date.now(), size: 100, url: '' }] },
  { fileList: [] },
  { fileList: [] },
]);

// handleBeforeUpload 在上传前触发，返回 true 允许上传
const handleBeforeUpload = async (file: File, item: any) => {
  console.log('上传的文件信息:', file);

  // 如果文件类型不是 jpeg、png 或 pdf，阻止上传
  if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
    alert(`只允许上传 JPG、PNG 或 PDF 文件，文件 ${file.name} 类型不支持`);

    // 手动将不符合要求的文件添加到 fileList 中
    const failedFile = {
      name: file.name,
      status: 'success', // 设置状态为 failed，表示上传失败
      uid: Date.now(), // 使用时间戳生成唯一标识符
      size: file.size, // 设置文件大小
      url: '', // 可以为空，或者使用一个错误的 url，表示没有上传
    };

    // 更新 fileList，确保文件显示在列表中
    item.fileList = [...item.fileList, failedFile]; // 使用 spread 运算符重新赋值

    // 阻止上传，但保留文件在列表中
    return false;
  }

  // 如果符合条件，允许上传
  return true;
};

// handleBeforeRemove 在文件移除前触发
const handleBeforeRemove = async (file: File) => {
  console.log('准备移除文件:', file.name);
  return true; // 返回 true，允许移除文件
};

// handleRemove 在文件移除后触发
const handleRemove = (file: File, item: any) => {
  console.log('移除文件:', file.name);

  // 确保从 fileList 中移除对应的文件
  const index = item.fileList.findIndex(f => f.uid === file.uid);
  if (index !== -1) {
    item.fileList.splice(index, 1);  // 删除对应文件
    console.log('文件已移除:', file.name);
  }

  // 此时 item.fileList 已经被更新，页面会自动刷新
  return true; // 返回 true 保证文件被移除
};
</script>
