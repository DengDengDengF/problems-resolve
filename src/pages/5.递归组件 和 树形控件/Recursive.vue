<template>
  <div>
    <cascader v-for="(item, index) in source" :key="index" :sourceItem="item"></cascader>
  </div>
</template>


<script>
import cascader from "../../components/cascader.vue";
import {reactive} from "vue";

export default {
  name: "Recursive",
  components: {cascader},
  setup(props) {
    const source = reactive([
      {
        name: '浙江',
        children: [
          {
            name: '杭州',
            children: [
              {name: 'shang'},
              {name: 'xia'},
              {name: 'jianggan'}
            ]
          },
          {
            name: '嘉兴',
            children: [
              {name: 'shang'},
              {name: 'xia'},
              {name: 'jianggan'}
            ]
          }
        ]
      },
      {
        name: '湖南',
        children: [
          {
            name: '长沙',
            children: [
              {name: 'shang'},
              {name: 'xia'},
              {name: 'jianggan'}
            ]
          },
          {
            name: '湘潭',
            children: [
              {name: 'shang'},
              {name: 'xia'},
              {name: 'jianggan'}
            ]
          }
        ]
      },
    ]);
    return {
      source,
    }
  }
}
</script>


<style scoped>

</style>
