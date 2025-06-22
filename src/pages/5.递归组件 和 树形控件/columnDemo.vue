<template>
  <div class="m50">
    <el-table border style="margin-top: 50px;" :data="originData">
      <el-table-column prop="type" label="题型" align="center"></el-table-column>
      <el-table-column prop="num" label="数量" align="center"></el-table-column>
      <el-table-column prop="average" label="均分" align="center"></el-table-column>
    </el-table>

    <el-table border style="margin-top: 50px;" :data="transData">
      <el-table-column
          v-for="(item, index) in transTitle"
          :key="index"
          :label="item"
          align="center"
      >
        <template #default="scope">
          {{ scope.row[index] }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import "element-plus/es/components/table/style/css";
import "element-plus/es/components/table-column/style/css";

const originData = ref([
  { type: "选择题", num: "8题", average: "3分/题" },
  { type: "填空题", num: "5题", average: "3分/题" },
  { type: "选择题", num: "2题", average: "10分/题" },
]);

const originTitle = ref(["题型", "数量", "均分"]);
const transTitle = ref(["", "学生1", "学生2", "学生3"]);
const transData = ref([]);

const transposeData = () => {
  const matrixData = originData.value.map((row) => Object.values(row));
  transData.value = matrixData[0].map((_, colIndex) => [
    originTitle.value[colIndex],
    ...matrixData.map((row) => row[colIndex]),
  ]);
};

onMounted(() => {
  transposeData();
});
</script>

<style scoped>
.m50 {
  margin: 50px;
}
</style>
