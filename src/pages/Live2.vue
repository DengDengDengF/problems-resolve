<template>
  <div class="main">
    <LivePlayer
        style="width: 50%;height: 50%;"
        @message="message"
        videoUrl="https://livedoc.cgtn.com/500d/prog_index.m3u8" fluent autoplay live stretch></LivePlayer>
  </div>
</template>


<script>
import LivePlayer from '@liveqing/liveplayer-v3' // vue3

export default {
  name: "Live2",
  components: {
    LivePlayer
  },
  setup() {
    const message = () => {
         console.log('ss')
    };
    return {message}
  }
}
</script>


<style scoped lang="less">
.main{
  width: 100%;
  height: 400px;
  //border: 1px solid red;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
