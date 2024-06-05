# Vue 3 + Vite

This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (previously Volar) and disable Vetur



```js
npm init vite-app <projectName>

cd <projectName>

npm i

npm run dev
```

### 1.弹窗封装

```js
vue文件:通过props传入参数，依据参数进行显示，编写css
js文件：调取vue文件，传入必要参数，利用vue的unmount去卸载组件
调取js文件传入参数，参数以props的形式流动
```

### 2.pdf封装

```js
想着不用二进制流的方式去传递 使用 vue-pdf-embed，可以显示但是有些模糊，想获取页面的最大page,可是费劲了。
于是，用了某大神封装的 pdf-vue3,和vue-pdf-embed相比就是一个天上一个地下。
在使用 pdf-vue3的基础下，我给加了个 监听ctrl+wheel的事件，可以放大缩小pdf
github地址：https://github.com/hymhub/pdf-vue3
特此感谢！
```

### 3.文件上传、断点续传

```js
按照指定大小对文件进行拆分，要求每片文件都有hash、name、uploaded(是否上传)等信息
上传每片文件、合并这些文件
断点续传，就是检查文件的uploaded,对未上传的进行上传，最后进行合并
```

