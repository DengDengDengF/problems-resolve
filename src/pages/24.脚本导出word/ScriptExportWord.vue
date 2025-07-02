<template>
  <a href="#" @click.prevent="downloadDocx">下载Word文档</a>
</template>

<script setup>
import { Document, Paragraph, Packer, ImageRun } from 'docx';

const downloadDocx = async () => {
  const imageUrl = 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg';

  try {
    // 获取图片数据
    const response = await fetch(imageUrl, {mode: 'cors'});
    if (!response.ok) throw new Error(`图片加载失败: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    console.log('图片数据大小:', arrayBuffer.byteLength); // 确保图片数据加载

    // 创建ImageRun对象
    const image = new ImageRun({
      data: arrayBuffer,
      transformation: {
        width: 100, //
        height: 100,
      },
      type:'png' //不加这个选项，谷歌文档插件就识别不了图片。使用谷歌文档插件，硬性要求固定宽高，没有自适应。
    });

    // 创建最简单的文档
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [image],
          }),
        ],
      }],
    });

    // 生成并下载文档
    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '测试文档.docx';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

  } catch (error) {
    console.error('生成失败:', error);
    alert(`生成失败: ${error.message}`);
  }
};
</script>