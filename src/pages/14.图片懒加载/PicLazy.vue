<template>
  <div>
    <img :class="lazy" data-src="https://img.dpm.org.cn/Uploads/Picture/2021/05/31/s60b446b015652.jpg">
    <img :class="lazy" data-src="https://img.dpm.org.cn/Uploads/Picture/2021/05/31/s60b445921bdfe.jpg">
    <img :class="lazy" data-src="https://img.dpm.org.cn/Uploads/Picture/2021/05/31/s60b443ac90165.jpg">
    <img :class="lazy" data-src="https://img.dpm.org.cn/Uploads/Picture/2021/05/31/s60b4430138464.jpg">
    <img :class="lazy" data-src="https://img.dpm.org.cn/Uploads/Picture/2021/05/31/s60b441f616f18.jpg">

    <!--    <img loading="lazy" src="https://img.dpm.org.cn/Uploads/Picture/2021/05/31/s60b446b015652.jpg" alt="...">-->
    <!--    <img loading="lazy" src="https://img.dpm.org.cn/Uploads/Picture/2021/05/31/s60b445921bdfe.jpg" alt="...">-->
    <!--    <img loading="lazy" src="https://img.dpm.org.cn/Uploads/Picture/2021/05/31/s60b443ac90165.jpg" alt="...">-->
    <!--    <img loading="lazy" src="https://img.dpm.org.cn/Uploads/Picture/2021/05/31/s60b4430138464.jpg" alt="...">-->
    <!--    <img loading="lazy" src="https://img.dpm.org.cn/Uploads/Picture/2021/05/31/s60b441f616f18.jpg" alt="...">-->
  </div>
</template>
<script>
/**
 * 通过判断图片是否在视口内部，决定是否加载图片，
 * const {top,right,bottom,left,} = element.getBoundingClientRect();拿到视口位置
 * 在视口内部，就取消lazy类，并src=data-src
 * */
import picBounding from "../../utils/piclazy/picBounding.js";
import {onMounted, onUnmounted, ref} from "vue";

export default {
  name: "PicLazy",
  setup() {
    const lazy = ref('lazy');
    onMounted(() => {
      picBounding(lazy.value);
      document.addEventListener("scroll", () => picBounding(lazy.value));
      window.addEventListener("resize", () => picBounding(lazy.value));
      window.addEventListener("orientationChange", () => picBounding(lazy.value));
    });
    onUnmounted(() => {
      document.removeEventListener("scroll", picBounding);
      window.removeEventListener("resize", picBounding);
      window.removeEventListener("orientationChange", picBounding);
    });
    return {
      lazy,
    }
  }
}
</script>


<style scoped lang="scss">
img {
  width: 400px;
  height: 300px;
  display: block;
  border: 1px solid #d9d9d9;
  margin: 20px auto;
}
</style>
