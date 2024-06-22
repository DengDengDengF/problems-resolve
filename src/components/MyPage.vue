<template>
  <div class="my-pagination">
    <el-pagination
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalItems"
        :layout="layout"
        @current-change="handleCurrentChange">
    </el-pagination>
  </div>
</template>

<script>
import {defineComponent} from 'vue';


export default defineComponent({
  name: 'MyPae',
  props: {
    totalItems: {//总的数据个数
      type: Number,
      required: true
    },
    pageSize: { //每页显示几个
      type: Number,
      default: 1
    },
    currentPage: {//当前页
      type: Number,
      default: 1
    },
    layout: {
      type: String,
      default: 'prev, pager, next, jumper, ->, total'
    }
  },
  emits: ['update:currentPage', 'update:pageSize', 'page-changed', 'size-changed'],
  methods: {
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.$emit('update:currentPage', newPage);
      this.$emit('page-changed', newPage, this.pageSize);
    },
  }
});
</script>

<style scoped>
.my-pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}
</style>
