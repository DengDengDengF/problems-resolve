<template>
  <div class="cascader-wrapper">
    {{ sourceItem.name }}
    <cascader
        class="cascader-item"
        v-if="sourceItem.children"
        v-for="item in sourceItem.children"
        :sourceItem="item">
    </cascader>
  </div>
</template>


<script>
export default {
  name: "cascader",
  props: {
    sourceItem: {
      type: Object,
      required: true
    }
  }
}
</script>


<style scoped lang="less">
.cascader-wrapper {
  border: 1px solid black;
  width: 40%;
  overflow: hidden;
  padding: 2px;
  .cascader-item {
        margin-left: 10px;
        width: 100%;
  }
}
</style>
