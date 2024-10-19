<template>
  <div class="custom-tree-container">
    <el-tree
        style="max-width: 600px"
        :data="dataSource"
        show-checkbox
        node-key="id"
        :check-on-click-node="true"
        :default-checked-keys="defaultChecked"
        @check="checkNode"
    >
      <template #default="{ node, data }">
        <span class="custom-tree-node">
          <span>{{ data.title }}</span>
          <span v-if="data.mode == 'all' &&  data.children.length==0" >
            <a  :style="{color:data.method.indexOf('post') != -1?'red':'black'}" @click.stop="methodClick(data,'post')"> 编辑 </a>
            <a :style="{color:data.method.indexOf('put') != -1?'red':'black',marginLeft:'8px'}"  @click.stop="methodClick(data,'put')"> 新增 </a>
            <a :style="{color:data.method.indexOf('delete') != -1?'red':'black',marginLeft:'8px'}"  @click.stop="methodClick(data,'delete')"> 删除 </a>
          </span>
        </span>
      </template>
    </el-tree>
    <el-button  @click="turnInto">生成指定格式</el-button>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, reactive, ref} from 'vue'
import {dataList} from './menu'


const dataSource=ref(null);
const defaultChecked=reactive([])
//用哈希 存储 菜单 id当key
const hashHell = reactive({})
//构造双向链表
function createLinkedListFromArray(dataArray, parent = null) {
  // 遍历数组并为每个对象创建链表节点
  return dataArray.map(data => {
    const node = {
      id: data.id,
      title: data.meta.title,
      path: data.path,
      mode: "none", // 默认为 none
      parent: parent,
      method:[],
      children: []
    };
    if(hashHell.hasOwnProperty(node.id)){
        node.mode=hashHell[node.id].mode
        if(hashHell[node.id].hasOwnProperty("method")){
            node.method=hashHell[node.id]["method"]
        }
    }
    // 如果当前节点有子节点，则递归处理子节点
    if (data.children && Array.isArray(data.children)) {
      node.children = createLinkedListFromArray(data.children, node);
    }

    return node;
  });
}
//修改下面节点的mode
function updateModeForChildren(node,pattern) {
  node.mode = pattern;
  // 如果当前节点有子节点，递归设置所有子节点的 mode
  if (node.children && node.children.length > 0) {
    node.children.forEach(child => {
      updateModeForChildren(child,pattern);
    });
  }
}
// 递归函数：向上遍历并更新父节点的 mode
function updateModeForParent(node) {
  if (!node.parent) return; // 如果没有父节点，停止递归
  let noneNum=0;
  let children=node.parent.children
  for(let i=0;i<children.length;i++){
    if(children[i].mode == "none") noneNum++;
  }
  if (noneNum==0) {
    node.parent.mode = 'all';
  } else if (noneNum < children.length) {
    node.parent.mode = 'half';
  }else{
    node.parent.mode = 'none';
  }
  // 继续向上递归检查父节点
  updateModeForParent(node.parent);
}

const checkNode=(data,node)=>{
  const isChecked = node.checkedKeys.includes(data.id);
  updateModeForChildren(data,isChecked ? "all" : "none")
  updateModeForParent(data)
}

const methodClick=(data,type)=>{
  const index = data.method.indexOf(type);
  index !== -1 ? data.method.splice(index, 1) : data.method.push(type);
}
//把半选中 和全选的返回
const findNodesWithModes = (nodes, results = []) => {
  nodes.forEach(node => {
    // 检查当前节点的 mode
    if (node.mode === "all" || node.mode === "half") {
      results.push(node); // 将符合条件的节点推入结果数组
    }
    // 递归遍历子节点
    if (node.children && node.children.length > 0) {
      findNodesWithModes(node.children, results);
    }
  });

  // 返回结果数组
  return results;
};
const turnInto=()=>{
  let arr=findNodesWithModes(dataSource.value)
  console.log(arr)
}

onMounted(() => {
  let hell = [{id: 5, title: "首页", path: "/", mode: "all"},
    {id: 6, title: "概览", path: "index", mode: "all", method: ["post", "delete"]},
    {id: 85, title: "评论管理", path: "comments", mode: "all", method: ["put"]},
    {id: 41, title: "营销", path: "/marketing", mode: "half"},
    {id: 26, title: "系统拼多多联盟", path: "pinduoduoSys", mode: "all", method: ["put"]},
    {id: 41, title: "营销", path: "/marketing", mode: "half"},
    {id: 22, title: "电商", path: "/store", mode: "half"},
    {id: 33, title: "拼多多", path: "/pdd", mode: "half"},
  ]
  for (let i = 0; i < hell.length; i++) {
    hashHell[hell[i].id]=hell[i]
    if(hell[i].mode == "all"){
      defaultChecked.push(hell[i].id)
    }
  }
  dataSource.value=createLinkedListFromArray(dataList.data.list)
})

</script>

<style>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
