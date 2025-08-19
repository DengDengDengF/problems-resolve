<template>
  <div class="p-4">
    <el-select
        v-model="ruleForm.userId"
        class="m-2"
        data-class="selectClass"
        placeholder="请选择"
        filterable
        :filter-method="filterMethod"
        v-select-load-more="getUserList"
        popper-class="selectClass"
    >
      <el-option
          v-for="item in options"
          :key="item.userId"
          :label="item.nickname"
          :value="item.userId"
      />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue';
import { ElSelect, ElOption } from 'element-plus';

// Types
interface User {
  userId: number;
  nickname: string;
}

interface ApiResponse {
  data: {
    datas: User[];
    totalPages: number;
  };
}

// Simulated API
const getUserSupplierList = async (params: {
  page: number;
  pageSize: number;
  nickname?: string;
}): Promise<ApiResponse> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const totalItems = 35;
  const pageSize = params.pageSize || 10;
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = params.page * pageSize;
  const datas = Array.from({ length: pageSize }, (_, i) => ({
    userId: start + i + 1,
    nickname: `用户 ${start + i + 1} ${params.nickname || ''}`,
  })).filter(item => item.userId <= totalItems);
  return { data: { datas, totalPages } };
};

// State
const options = ref<User[]>([]);
const ruleForm = reactive<{
  userId: number | null;
}>({
  userId: null,
});

const userParams = reactive<{
  page: number;
  pageSize: number;
  nickname: string;
}>({
  page: 0,
  pageSize: 10,
  nickname: '',
});

let totalPage = ref(1);

// Load more users
const getUserList = async () => {
  if (userParams.page < totalPage.value) {
    const res = await getUserSupplierList(userParams);
    if (userParams.page === 0) {
      totalPage.value = res.data.totalPages;
      options.value = [];
    }
    options.value = [...options.value, ...res.data.datas];
    userParams.page++;
  }
};

// Filter method
const filterMethod = async (val: string) => {
  userParams.page = 0;
  userParams.nickname = val;
  await nextTick();
  const element = document.querySelector('.selectClass .el-select-dropdown__wrap') as HTMLElement;
  if (element) element.scrollTop = 0;
  const res = await getUserSupplierList(userParams);
  options.value = res.data.datas;
  totalPage.value = res.data.totalPages;
  userParams.page = 1;
};

// Custom directive for infinite scroll
const vSelectLoadMore = {
  mounted(el: HTMLElement, binding: { value: () => void }) {
    const dataClass = el.getAttribute('data-class');
    if (!dataClass) return;

    const popperEl = document.querySelector(`.${dataClass} .el-select-dropdown__wrap`) as HTMLElement;
    if (!popperEl) return;

    const scrollHandler = () => {
      const { scrollTop, scrollHeight, clientHeight } = popperEl;
      if (scrollHeight - scrollTop - clientHeight <= 0) {
        binding.value();
      }
    };

    popperEl.addEventListener('scroll', scrollHandler);

    // Store the handler for cleanup
    el['_scrollHandler'] = scrollHandler;
  },
  unmounted(el: HTMLElement) {
    const dataClass = el.getAttribute('data-class');
    if (!dataClass) return;

    const popperEl = document.querySelector(`.${dataClass} .el-select-dropdown__wrap`) as HTMLElement;
    if (!popperEl || !el['_scrollHandler']) return;

    popperEl.removeEventListener('scroll', el['_scrollHandler']);
    delete el['_scrollHandler'];
  },
};
</script>

<style>
.selectClass .el-select-dropdown {
  width: 200px !important;
}
</style>