<template>
  <div class="top">
    <div>
      <input
          style="cursor: pointer"
          type="checkbox"
          :checked="allSelected"
          :indeterminate.prop="someSelected"
          @change="toggleAll(($event.target as HTMLInputElement).checked)"
      />
    </div>
    <div
        style="margin-left: 10px; font-size: 14px; user-select: none"
        :style="{
                cursor: selectedUIds.length > 0 ? 'pointer' : 'default',
                color: selectedUIds.length > 0 ? 'red' : 'rgb(96, 98, 102, 0.6)'
              }"
        @click="batchDelete"
    >
      批量删除{{ selectedUIds.length > 0 ? '（已选中' + selectedUIds.length + '个）' : '' }}
    </div>
    <input
        type="file"
        @change="fileChange"
        ref="uploadRef"
        :webkitdirectory="true"
        :multiple="true"
        accept="."
    />
<!--    <span style="color: #409eff">还剩{{md5Uncalculated}}个没计算</span>-->
    <div><el-input v-model="netSpeed" type="number" style="width: 200px" placeholder="请输入网速" @blur="threadSpeed(netSpeed * 1024 * 1024)"/> MB/S</div>
  </div>
  <el-scrollbar :height="500" always style="padding-right:20px">
    <div v-for="item in  fileList" class="lists">
      <div class="lists-item">
        <div class="left">
          <input
              type="checkbox"
              v-model="selectedUIds"
              :value="item.uid"
              style="cursor: pointer"
          />
          <span>{{ item.file.name }}</span>
        </div>
        <div class="right">
          <span :style="{color:md5StatusHash[item.md5Status].color}">{{
              md5StatusHash[item.md5Status].value
            }}-{{ item.md5 }}</span>
          <span v-if="item.errorMsg" style="color: red">{{ item.errorMsg }}</span>
          <span
              @click="del(item.uid)"
              class="upload_delete"
          ><el-icon> <Delete/> </el-icon
          ></span>
        </div>
      </div>
    </div>
  </el-scrollbar>
  <span style="color: red;cursor:pointer" v-if="md5ErrorList.length" @click="retry">重试 {{md5ErrorList.length > 0 ? md5ErrorList.length : ''}}</span>
</template>

<script setup lang="ts">
/**
 * 主线程vue文件，
 * -单worker负责md5计算 与 主线程并发上传 完全解耦
 * -针对worker线程 以及 主线程上传队列，添加、修改、销毁、重试
 * -ui展示交互,进度、结果
 * -其他业务逻辑
 * -获取worker线程 和 主线程上传队列的状态，成功列表、失败列表、是否运行结束等
 * -获取上传的网速，对磁盘吞吐调速
 * */
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
import {
  arrangeFileToWorkers,
  batchClearInWorkers,
  terminateThreads,
  initThreads,
  md5ErrorList,
  threadSpeed,
  md5Uncalculated
} from './thread-main-md5'

const fileList = ref<any[]>([])
const md5StatusHash = {
  0: {value: '未计算', color: '#999999'},
  1: {value: '计算中', color: '#FFA500'},
  2: {value: '计算完成', color: '#28a745'},
  3: {value: '计算失败', color: '#dc3545'},
}
const selectedUIds = ref<any>([])
const allSelected = computed(() => selectedUIds.value.length > 0 && selectedUIds.value.length === fileList.value.length)
const someSelected = computed(() => selectedUIds.value.length > 0 && !allSelected.value)
const netSpeed=ref<number>()

//单个删除
const del = (uid: string) => {
  batchClearInWorkers([uid])
  fileList.value = fileList.value.filter((v) => v.uid != uid)
  //TODO 主线程uploadLib.ts 单个删除
}
//批量删除
const batchDelete = () => {
  const del_list = [], uidSetList = new Set()
  for (let uid of selectedUIds.value) {
    del_list.push(uid)
    uidSetList.add(uid)
  }
  batchClearInWorkers(del_list)
  fileList.value = fileList.value.filter((v) => !uidSetList.has(v.uid))
  //TODO 主线程uploadLib.ts 批量删除
}
/**初始化文件
 * md5Status:0未计算 1计算中 2计算完成 3计算失败*/
const initFile = (file: File) => ({file, md5: '', errorMsg: '', uid: crypto.randomUUID(), md5Status: 0})
//全部选中
const toggleAll = (flag: boolean) => {
  selectedUIds.value = flag ? fileList.value.map((i) => i.uid) : []
}
//重试
const retry = () => {
  //TODO 做区分md5算错的、上传过程报错的
  const lists = [...md5ErrorList.value]
  lists.sort((a, b) => a.file.size - b.file.size)
  arrangeFileToWorkers(lists)
  //TODO 某个函数支持重试上传过程报错的
}
const fileChange = async (event: any) => {
  const lists: any[] = Array.from(event.target?.files || [])
  if (lists.length == 0) return
  lists.sort((a, b) => a.size - b.size)
  const myLists = []
  //TODO 是否加入抽样MD5校验重复？等等校验逻辑，必须轻量级
  for (let file of lists) {
    const item = initFile(file)
    fileList.value.push(item)
    //TODO 只有通过校验（非重复、资源信息可取....）的 才有资格进入全量MD5计算
    myLists.push(fileList.value[fileList.value.length - 1])
  }
  arrangeFileToWorkers(myLists)
  event.target.value = ''
}
onMounted(async () => {
  //清除副作用
  await terminateThreads()
  //初始化线程
  await initThreads()
  //刷新页面自动关闭所有线程
  window.addEventListener('beforeunload', terminateThreads)
})
//组件卸载前，趁着引用没有丢，自动关闭所有线程
onBeforeUnmount(async () => {
  await terminateThreads()
  window.removeEventListener('beforeunload', terminateThreads)
})
</script>

<style scoped>
.lists {
  display: flex;
  flex-direction: column;

  .lists-item {
    display: flex;

    .left {
      width: 50%;
    }

    .right {
      width: 50%;
      display: flex;
      justify-content: space-between;
    }
  }
}

.top {
  display: flex;
  gap: 20px
}
</style>