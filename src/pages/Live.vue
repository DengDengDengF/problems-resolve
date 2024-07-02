<template>
  <div class="title"></div>
  <div class="play">
    <div class="play_left">
      <videoPlay
          v-bind="options"
          poster='https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/ironMan.jpg'
          @play="onPlay"
          @pause="onPause"
          @timeupdate="onTimeupdate"
          @canplay="onCanplay"
      />
    </div>
    <div class="play_right"></div>
  </div>
  <div class="tail"></div>
</template>


<script>
//require style
import 'vue3-video-play/dist/style.css';
import {videoPlay} from "vue3-video-play/dist";
import {reactive} from "vue";

export default {
  name: "Live",
  components: {
    videoPlay
  },
  setup() {
    const options = reactive({
      width: '800px', //播放器高度
      height: '450px', //播放器高度
      color: "#409eff", //主题色
      title: 'iron man', //视频名称
      src: "https://cdn.jsdelivr.net/gh/xdlumia/files/video-play/IronMan.mp4", //视频源
      muted: false, //静音
      webFullScreen: false,
      speedRate: ["0.75", "1.0", "1.25", "1.5", "2.0"], //播放倍速
      autoPlay: true, //自动播放
      loop: false, //循环播放
      mirror: false, //镜像画面
      ligthOff: false,  //关灯模式
      volume: 0.3, //默认音量大小
      control: true, //是否显示控制
      controlBtns: ['audioTrack', 'quality', 'speedRate', 'volume', 'setting', 'pip', 'pageFullScreen', 'fullScreen'], //显示所有按钮,
      currentTime: 60,//从哪里开始
      speed: true, //关闭/开始/进度条拖动
    });
    const onPlay = (ev) => {
      console.log('播放')
    }
    const onPause = (ev) => {
      // console.log(ev, '暂停')
    }

    const onTimeupdate = (ev) => {
      // console.log(ev, '时间更新')
    }
    const onCanplay = (ev) => {
      // console.log(ev, '可以播放')
    }
    return {options, onPlay, onPause, onTimeupdate, onCanplay}
  }
}
</script>


<style scoped lang="less">
body {
  margin: 0;
  padding: 0;
}

.title {
  width: 960px;
  height: 100px;
  background: #19CAAD;
}

.play {
  width: 960px;
  height: 500px;
  display: flex;
  //border: 1px solid black;

  .play_left {
    width: 800px;
    height: 100%;
    //border: 1px solid red;
    display: flex;
    align-items: center;
    background: #ecad9e;
  }

  .play_right {
    flex: 1;
    background: #D6D5B7;
  }
}

.tail {
  width: 960px;
  height: 200px;
  background: #F4606C;
}

@media screen  and(min-width: 960px) {
  .title {
    width: 100%;
  }

  .play {
    width: 100%;
  }

  .tail {
    width: 100%;
  }
}
</style>
