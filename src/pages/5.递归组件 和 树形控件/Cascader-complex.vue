<template>
  <div class="m-4">
    <p>Collapse tags tooltip</p>
    <el-cascader
        v-model="selectedValues"
        :options="options"
        :props="props"
        collapse-tags
        collapse-tags-tooltip
        clearable
    />
    <button @click="test"> obtail</button>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {dataList} from './interfaces'

const props = {multiple: true}
const selectedValues = ref(null);
let id = 10000;
let options = ref(null)

// 函数将输入数组转换为嵌套对象
// 这里用的哈希，前提是 不能一个子 有多个父 说人话 就是 [资产/大健康自研页]转让自研页所有者  大健康自研页必须只有一个父有且只能为资产
//到此 正式拿下角色管理 fuck!
function buildOptions(data) {
  const options = [];
  const map = {}; // 用于查找已存在的节点
  for (let i = 0; i < data.length; i++) {
    const splitData = data[i].name.split(/[\[\]\/]+/).filter(Boolean);
    let next = options
    for (let i = 0; i < splitData.length - 1; i++) {
      let item = splitData[i]
      if (!map[item]) {
        let node = {
          value: id++,
          label: item,
          children: []
        }
        next.push(node)
        map[item] = node
        next = node.children
      } else {
        next = map[item].children
      }
    }
    next.push({value: data[i].id, label: data[i].name, children: []})
  }
  return options
}

onMounted(() => {
  let list = dataList.data.list;
  options.value = buildOptions(list)
  selectedValues.value = [48, 64, 75, 89, 97, 99, 118, 119, 167, 215, 217, 287, 289, 361, 382, 444]  //产品经理
})
const test = () => {
  for (let i = 0; i < selectedValues.value.length; i++) {
    let current=selectedValues.value[i]
    if (typeof current == "object") {
      selectedValues.value[i]=current[current.length-1]
    }
  }
  console.log(selectedValues.value)
}
</script>

<style>
/* 添加你的样式 */
</style>
