<template>
  <div>
    <MyPage
        :total-items="totalItem"
        v-model:currentPage="currentPage"
        v-model:pageSize="pageSize"
        @page-changed="onPageChanged">
    </MyPage>
  </div>
</template>

<script>
import {ref} from 'vue';
import MyPage from "../../components/MyPage.vue";

export default {
  components: {
    MyPage
  },
  setup() {
    const totalItem = ref(100); //总数据
    const currentPage = ref(1);//当前页
    const pageSize = ref(1);//一页显示多少个
    const onPageChanged = (newPage, pageSize) => {
      console.log(`Page changed to: ${newPage}, Page size: ${pageSize}`);
      // 这里可以添加你的分页逻辑，例如从服务器获取新数据等
    };
    return {
      currentPage,
      pageSize,
      totalItem,
      onPageChanged,
    };
  }
};
</script>
