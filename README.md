[TOC]



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

这里可以结合dom闭包卸载
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
按照指定大小对文件进行拆分，要求每片文件都有file、filehash、uploaded(是否上传)、chunkIndex等信息。
1.文件切片的流程，就是通过记录切片位置和一次性切片大小，进行分割文件。
2.获取哈希的流程，就是读取流，然后用SparkMD5获取文件哈希。
3.涉及到分批后批量上传，使用基于队列的文件分批上传
4.上传成功后uploaded是true,否则为false
5.断点续传就是对uploaded是false的进行上传

上传每片文件、合并这些文件


tips: 
//读取blob，用于获取文件哈希等
const fileReader = new FileReader();
fileReader.readAsArrayBuffer(file);
//blob流转base64，用于图片转base64
const reader = new FileReader();
reader.readAsDataURL(file);
//文件发送
let fd = new FormData();//要发送的表单数据
fd.append('file', chunk.file);
fd.append('fileHash', chunk.fileHash);
fd.append('chunkIndex', chunk.chunkIndex);
```

### 4.动态表单

```js
只考虑功能实现，不考虑css。
不显示、显示1个、显示多个，显示n个，
设计成链表就可以。
0--->null
1---->a-b
2---->{
     1，
     c-d
}
.......

后台传递过来数据，根据后台的数据，前台实现逻辑
```

<img src="https://s2.loli.net/2024/06/05/WwUcOydQqgGNSls.png" alt="image.png" style="zoom:50%;" />

<img src="https://s2.loli.net/2024/06/05/SWmGw5jclX2hbfL.png" alt="image.png" style="zoom:50%;" />

<img src="https://s2.loli.net/2024/06/05/skR7P6femMB2T1h.png" alt="image.png" style="zoom:50%;" />

### 5.递归template

```js
自己调用自己，适用于高度耦合的对象，
```

### 6.树形控件

```js
以下两种情况都要递归调用，结合vue3.0语法
对每一个 父 打对勾，子要全部 打对勾。------>遍历当前父的每一个子
每一个子 都 打对勾，父要全部 打对勾 ------->遍历当前子的父/父兄，做判定，
```

<img src="https://s2.loli.net/2024/06/06/RlTv6oOS9JfcVxq.png" alt="image.png"  /><img src="https://s2.loli.net/2024/06/06/eDJpwrT24UWlCyx.png" alt="image.png"  /><img src="https://s2.loli.net/2024/06/06/yH9AKRonvumNW6h.png" alt="image.png"  />

### 7.分批多线程请求、分批但是要求批次的顺序、不分批逐个上传

```js
1.分批多线程---不要求调用顺序----使用队列，

利用执行栈中的顺序，先同步后异步,维护并发队列的长度
出队列之前，队列长度--；
有回调结果后，队列长度++，进行下一个任务；
适用于，没有要求调用顺序的。文件分批上传只要，我们把哈希值、分割文件的index、传给后台即可。
但是如果要求调用顺序呢？
```

<img src="https://s2.loli.net/2024/06/06/6hqvsBK9MjkNSXL.png" alt="image.png" style="zoom: 67%;" />

```
2.分批多线程---不要求调用顺序----利用js的同步异步，虽然 队列的方式 也利用了同步异步
```

![image.png](https://s2.loli.net/2024/06/06/kIvrVEem549UYtH.png)

 

**其实算法思想都一样，都是用的队列，不过第二种含蓄点**



```js
3.分批，但是要求批次的顺序。
使用promise.all([....promise请求]).then((allData)=>{
       //递归调用,下一个批次请求
   }).catch((err)=>{
       //抛出错误,throwError(err)
   })
```

```js
4.逐个上传
callback(arr.shift()).then((result)=>{
    //递归调用,下一个请求
})
```



### 8.策略模式

```
封装策略，实现可复用、可扩展和可维护，并且避免大量复制粘贴的工作。
给了一个表单校验简单demo展示
```

### 9.拖拽排序封装

```js
用到了drag的api，实现拖拽排序
核心模块思路，删除原来位置，新位置之前插入，
当然还涉及到一些封装思路。
频繁的拖拽，还要写个防抖函数，略。
```

<img src="https://s2.loli.net/2024/06/07/8NcmhTS4bExiLJO.png" alt="image.png" style="zoom:50%;" />

### 10.内存泄露

```js
闭包、循环引用、dom引用等
```

### 11.自定义hooks

```
调接口、计数器、布尔切换、窗口size
都是提取的公共逻辑，做的封装。
```

### 12.虚拟列表

```js
虚拟列表其实是按需显示的一种实现，即只对可见区域进行渲染，对非可见区域中的数据不渲染或部分渲染的技术，从而达到极高的渲染性能；
1.计算外层可视化容量：itemHeight静态Math.ceil(containerHeight / itemHeightRef)
                  itemHeight动态就从fromIndex累加
2.计算列表数据对于container的偏移数量（offset),同上
3.计算在container区域内可显示的数据个数（calculateRange）。start: offset - overscan；end: offset + visibleCount + overscan。overscan为可允许溢出container范围的最大个数；
4.计算wrapper所有item总体的高度；可以用计算属性
5.列表距container的高度（distanceTop）
6.设置wrapper的高度和偏移量.
7.设置wrapper展示dom；
8.监听scroll事件，动态计算显示区域个数、显示区域范围、已经滚动的高度、wrapper的高度以及mariginTop

虚拟列表适用于渲染大量数据项的长列表场景。
经过测试99*10^4个dom节点都不在话下
```

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5ad0709233d94ab58eb9a7d5e7d095b1~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?" alt="png" style="zoom:50%;" />

### 13.时间分片

```js
把长时间运行的任务，分成多个小任务，穿插在空闲时间(用requestIdleCallback)，以便让浏览器有时间进行渲染和响应用户输入。这种技术使得应用在执行繁重计算任务时，仍然能够保持界面的流畅性和响应性。
//第一种做法：固定eachRenderNum
1.计算时间片，一次性渲染多少个(eachRenderNum )，总数据(originalList)除以，得到总共渲染多少次(times)。
2.开始渲染数据，通过 index > times 判断渲染完成，如果没有渲染完成，那么通过 requestIdleCallback 浏览器空闲执行下一帧渲染
3.通过 renderList 把已经渲染的 element 缓存起来.

//第二种：动态eachRenderNum
1.空闲时间剩余 deadline.timeRemaining()
2.持续时间 performance.now() - startTime
3.若最大允许持续时间为16

在完成一帧中的输入处理、渲染和合成之后，线程会进入空闲时期（idle period），直到下一帧开始，或者队列中的任务被激活，又或者收到了用户新的输入。requestIdleCallback 定义的回调就是在这段空闲时期执行：
```

![png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6a3201ed33ea4defa32b21f2ae31117c~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

### 14.axios封装

```js
基础配置文件暴露 请求基础地址(baseURL)、是否开启token认证(useTokenAuthorization)

axios 请求拦截中
1.若开启token认证,headers['Authorization'] =localStorage.getItem("token")
2.若没有设置请求头(!config.headers["Content-Type"])，并且是post请求，
  则headers["Content-Type"] = "application/x-www-form-urlencoded";
    data = qs.stringify(config.data);//序列化
3.headers["Content-Type"]默认是 "application/json"; 

axios相应拦截，就是设定不同状态返回。
```

### 15.ref封装

```js
ref本质也用了proxy,
通过ref文件，可以完成数据的修改，均可被get、set监听到。

get中 if(activeWatcher){//有watcher
      dep.depend(activeWatcher)//收集依赖
}
set中就通知更新dep.notify()
```

### 16.图片懒加载

```js
通过判断图片是否在视口内部，决定是否加载图片，
const {top,right,bottom,left,} = element.getBoundingClientRect();拿到视口位置
在视口内部，就取消lazy类，并src=data-src
```

### 17.表单封装

```html
因为不同模块的表单，内容上、逻辑上均高度相似，于是对表单做了封装
父组件的输入：
{
    itemType:text/number/textarea/select,//输入框类型
    labelName:'xxx'//输入框label
    propName:'xxx'//输入框字段
    isRequired:'true'//是否必填
    placeHolder:'',
    optionsArr:[...]//如果输入框类型是select要有
}
子组件，格式类似下面进行嵌套，根据itemType去回显
<el-form v-for="(item,index) in formHeader">
     </el-form-item  v-if="item.itemType == 'text'/'number'/'textarea'">
            <el-input></el-input>
     </el-form-item>
     </el-form-item v-if="item.itemType == 'select'">
            <el-select></el-select>
     </el-form-item>
</el-form>
然后就是，绑定change事件、写校验函数、确定、重置等
1.change事件里面，可以用正则表达式进行判断，判断不通过，对应的value为null,
2.校验函数，发现value为null,就可以根根据itemType，抛出错误。
3.提交函数，调用校验函数，进行校验，，校验成功，通过emit发送事件通知父组件
4.重置函数，调用form表单的重置方法，并把form表单v-model绑定的值设定为空对象。
```

### 18.分页封装

```js
分页用的是 <el-pagination></el-pagination>
只要是table，就要用到分页，因此可以进行以下封装
1.传入当前页、一页显示多少条、总的数据量、等数据给封装后的组件
2.当前页改变，通知父组件修改数据
```

### 19.less使用

```js
https://juejin.cn/post/7283422522535673856
变量、计算、混入、函数、通过函数动态计算、导入、继承、	嵌套

less 和 sass区别
sass有复杂的控制结构和函数支持 @if @for @each @while
sass解决了命名冲突问题 @use
```

### 20.SSE(Server-Sent-Events)，实现chatgpt一个字一个字跳出来

```js
//前端vue
 const message = ref('');
 const eventSource = new EventSource('http://localhost:5000/stream');
 eventSource.onmessage = (event) => {
      message.value += event.data;
 }
```

### 21.websocket

```js
  //前端value
    const message = ref('');
    const messages = ref([]);
    let socket = null;
    //接口返回
    const connectWebSocket = () => {
      socket = new WebSocket('ws://localhost:5001/');
      socket.onmessage = (event) => {
        messages.value.push( "server value:"+event.data);
      };
    };
    //输入框输入后，
    const sendMessage = () => {
      if (message.value.trim() !== '') {
        socket.send(message.value);
        messages.value.push(`You: ${message.value}`);
        message.value = '';
      }
    };
    // Connect WebSocket when component is mounted
    connectWebSocket();
```

### 22.SSE 和 WebSocket的不同

```
1.SSE 是比较适合单向数据传递的场景，尤其是当不需要从客户端频繁地向服务器发送数据时。SSE 可以用标准 HTTP 服务实现，对于服务器的改造相对较小。
2.WebSocket 比 SSE 更为强大，适用于需要快速、双向通信的应用。WebSocket 更复杂，需要专门的服务器和客户端支持。然而，它们提供了更低的延迟和更灵活的通信能力。
```

### 23.在线视频、直播

```js
在线视频使用,vue3-video-play
在线直播使用,LivePlayer

livePlayer直播的时候可以隐藏滚动条，vue3-video-play配置起来更简单
```

### 24.路由

```js
实现简易的 vue-router-hash
1.写个路由对象
2.监听hashChange事件，得到hash改变后的url
window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})
3.判断url是否在路由对象内，jue'ding

```

### 25.单点登录

```js
//参考https://juejin.cn/post/7088978055737114638
1.同域 用cookie设置主域，所有的子域都可以访问到主域的cookie.
2.不同域,部署SSO(Single Sign On)认证中心
    1.输入用户名、密码进行登录。登录成功获取token。存储在cookie中。
    2.从cookie中获取token,
       token不存在跳转到登录页。
       token存在，用token换取code。
       code不存在，清除cookie,跳转登录页。
       code存在，同域，直接将redirectUrl返回，,无需携带code接口返回的值，然后跳转。
       code存在，不同域，也就是第三方系统，redirecturl 拼接 code 后重定向到redirecturl.
    3.用户退出后，
       调用注销Api,
       清除cookie
       重定向到登录页。

tips:这里的token，是用来共享用户的登录状态。
后续，访问受保护的内容，可以用code(授权码)换取访问令牌（access token）、刷新令牌（refresh token）、会话令牌（session token）等。
```

### 26.动态路由

```js
//https://blog.csdn.net/lzfengquan/article/details/122918158
beforeEach路由拦截
      if(本地没有路由数据){
          1.axios后台获取路由
          2.使用递归对路由 componets组件拼接
          3.使用addRoutes添加路由
          4.拿到路由后再next()
      }else{
          next();
      }
```

<img src="https://s2.loli.net/2024/08/01/sPc7BlNaSkpEVRL.png" alt="image.png" style="zoom:50%;" />

### 27.vue3.0组件传值

```js
父子传值：父传子props,子传父emit
跨层级传输：provide inject
复杂组件：vuex;
```

### 28.el-tree复杂

```js
1.添加

用双向链表 抽象 原始数据，格式按照项目形式，选中状态全部false。用el-tree的click事件，选中/不选种递归状态检查。其中可以显示三个按钮，它是叶子结点，并且是选中状态
。
最后，提交事件中，遍历树，只要不是未选中状态的，就加入数组。

2.编辑
用双向链表 抽象原始数据，格式按照项目形式，选中状态全部false。传递过来的数据，用哈希id当key， （顺便把状态是all的加入回显数组，供回显）。对抽象数据，做二次抽象，用深度优先算法，匹配哈希id，修改状态，以及三个按钮。

用el-tree的click事件，选中/不选种递归状态检查。其中可以显示三个按钮，它是叶子结点，并且是选中状态
。
最后，提交事件中，遍历树，只要不是未选中状态的，就加入数组。

```

### 29.cascader巨复杂

```js
就是字符串分割 id自增 哈希优化等，
难点不在算法，在于实际业务工程化，反推
```

### 30.cookie 搭桥

<img src="https://s2.loli.net/2024/12/12/7ksxPAO8EQawq2S.png" alt="a67957a00836749139bb34e8ba754ee.png" style="zoom:50%;" />

以及 利用  storage 事件  监听两个相同域名  之间 互相本地存储的改变 从而去 window.reload()
