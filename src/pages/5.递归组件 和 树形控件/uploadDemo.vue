<template>
   <div style="border: 1px solid blue" :style="{height:height}">
     <el-table
         :data="tableData"
         style="width: 100%"
         :max-height="height - 100"
     >
       <el-table-column prop="date" label="Date" min-width="180" />
       <el-table-column prop="name" label="Name" min-width="180" />
       <el-table-column prop="address" label="Address"min-width="180" />
     </el-table>
     <div style="border: 1px solid red;width: 100%;height: 100px;">
       <el-pagination layout="prev, pager, next" :total="1000" style="margin-top: 20px" />
     </div>
   </div>
  <button @click="test">test</button>
</template>

<script lang="ts" setup>
import {ref} from "vue"
const height=ref(380)
const tableData = ref([])
let flag=true
const test=()=>{

  if(flag){
    tableData.value=[{
      date: '2016-05-03',
      name: 'Tomssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
      address: 'No. 189, Grove St, Los Angeles',
    }]
    flag=false
  }else{
    tableData.value=[
      {
        date: '2016-05-03',
        name: 'Tomssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-02',
        name: 'Tomsssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-08',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-06',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-07',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ]
    flag=true
  }
}
</script>