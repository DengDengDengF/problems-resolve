<template>
<div class="productCategory">
  <el-cascader
      v-model="showList"
      :options="options"
      :props="{
              value: 'value',
              label: 'label',
              children: 'children',
              multiple: true,
            }"
      :show-all-levels="true"
      clearable
      @change="changeSourceType"
  >
  </el-cascader>
</div>
</template>

<script setup>

import {ref} from "vue";

const showList = ref([])
const options = ref([
  {
    value: 1,
    label: 'Asia',
    children: [
      {
        value: 2,
        label: 'China',
        children: [
          { value: 3, label: 'Beijing' },
          { value: 4, label: 'Shanghai' },
          { value: 5, label: 'Hangzhou' }
        ]
      },
      {
        value: 6,
        label: 'Japan',
        children: [
          { value: 7, label: 'Tokyo' },
          { value: 8, label: 'Osaka' },
          { value: 9, label: 'Kyoto' }
        ]
      },
      {
        value: 10,
        label: 'Korea',
        children: [
          { value: 11, label: 'Seoul' },
          { value: 12, label: 'Busan' },
          { value: 13, label: 'Taegu' }
        ]
      }
    ]
  },
  {
    value: 14,
    disabled: false,
    label: 'Europe',
    children: [
      {
        value: 15,
        label: 'France',
        children: [
          { value: 16, label: 'Paris' },
          { value: 17, label: 'Marseille' },
          { value: 18, label: 'Lyon' }
        ]
      },
      {
        value: 19,
        label: 'UK',
        children: [
          { value: 20, label: 'London' },
          { value: 21, label: 'Birmingham' },
          { value: 22, label: 'Manchester' }
        ]
      }
    ]
  },
  {
    value: 23,
    label: 'North America',
    disabled: false,
    children: [
      {
        value: 24,
        label: 'US',
        children: [
          { value: 25, label: 'New York' },
          { value: 26, label: 'Los Angeles' },
          { value: 27, label: 'Washington' }
        ]
      },
      {
        value: 28,
        label: 'Canada',
        children: [
          { value: 29, label: 'Toronto' },
          { value: 30, label: 'Montreal' },
          { value: 31, label: 'Ottawa' }
        ]
      }
    ]
  }
])
let   lastPointer=0// 性能优化
const changeSourceType=(newSelect)=>{
    if(Array.isArray(newSelect) &&  newSelect.length > 0){
       const last = newSelect[newSelect.length - 1]
       if(lastPointer !== last[0]){
         showList.value=showList.value.filter(item=>item[0] === last[0])
         lastPointer = last[0]
       }
    }
}

</script>
<style lang="less" scoped>
/*
 1.确保el-cascader 的第一层 的checkbox不显示
 2.确保在 "1"的条件下，如果是"半选",要做颜色区分
 */
.el-cascader-menu:first-child {
  .el-cascader-node {
    .el-checkbox{
      display: none;
    }
    &:has(.is-indeterminate) {
      color: rgb(51.2, 126.4, 204) !important;
      font-weight: bold;
    }
  }
}
</style>

