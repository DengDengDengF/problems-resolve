<template>
  <el-cascader
      @change="handleCascaderChange"
      :options="options"
      :props="props1"
      collapse-tags
      clearable
      v-model="aaa"
  />

</template>

<script setup>

import {ref} from "vue";

const aaa = ref([])
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
const props1 = { multiple: true }
const handleCascaderChange = (value) => {
  console.log(value)
  if (value.length > 0) {
    options.value.map((item) => {
      if (item.value == value[0][0]) {
        item.disabled = false
      } else {
        item.disabled = true
      }
    })
  } else {
    options.value.map((item) => {
      item.disabled = false
    })
  }

  console.log(options)
  // aaa.value = [[1, 2, 4]]
}
</script>

<style scoped>
</style>
