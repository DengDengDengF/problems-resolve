<template>
  <div class="box">
    <Tree :data="list"></Tree>
  </div>
</template>


<script>
import Tree from '../../components/Tree.vue';
import {reactive} from "vue";

export default {
  name: "TreeShow",
  components: {Tree},
  setup(props) {
    const list = reactive([
      {
        id: 1,
        label: '一级 1',
        children: [
          {
            id: 4,
            label: '二级 1-1',
            children: [
              {
                id: 9,
                label: '三级 1-1-1'
              },
              {
                id: 10,
                label: '三级 1-1-2'
              }
            ]
          },
          {
            id: 5,
            label: '二级 1-2',
            children: [
              {
                id: 9,
                label: '三级 1-2-1'
              },
              {
                id: 10,
                label: '三级 1-2-2'
              }
            ]
          }
        ]
      },
      {
        id: 2,
        label: '一级 2',
        children: [
          {
            id: 5,
            label: '二级 2-1',
            children: [
              {
                id: 11,
                label: '三级 2-1-1'
              },
              {
                id: 12,
                label: '三级 2-1-2'
              }
            ]
          },
          {
            id: 6,
            label: '二级 2-2'
          }
        ]
      },
      {
        id: 3,
        label: '一级 3',
        children: [
          {
            id: 7,
            label: '二级 3-1'
          },
          {
            id: 8,
            label: '二级 3-2'
          }
        ]
      }
    ]);
    return {
      list
    }
  }
}
</script>


<style scoped lang="css">
.box{
  padding-top: 20px;
}
</style>
