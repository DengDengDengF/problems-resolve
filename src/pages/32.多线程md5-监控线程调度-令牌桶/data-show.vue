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
    <el-button type="danger" size="small" style="width: 120px" @click="clear">清空</el-button>
    <input
        type="file"
        @change="fileChange"
        ref="uploadRef"
        :webkitdirectory="true"
        :multiple="true"
        accept="."
    />
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
  <span style="color: red;cursor:pointer" v-if="md5ErrorList.length" @click="retry">重试</span>
</template>

<script setup lang="ts">
//主线程，该组件，仅仅用作ui展示，并确保不会对线程有副作用。
import {ref, computed, onMounted, onBeforeUnmount} from 'vue'
import {
  arrangeFileToWorkers,
  clearAllInWorkers,
  batchClearInWorkers,
  terminateThreads,
  initThreads,
  md5ErrorList
} from './thread-main'

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
//清空
const clear = () => {
  fileList.value.length = 0
  clearAllInWorkers()
  //TODO 主线程uploadLib.ts 清空
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
  //TODO 主线程uploadLib.ts 清空
  //刷新页面自动关闭所有线程
  window.addEventListener('beforeunload', terminateThreads)
})
//组件卸载前，趁着引用没有丢，自动关闭所有线程
onBeforeUnmount(async () => {
  await terminateThreads()
  //TODO 主线程uploadLib.ts 清空
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