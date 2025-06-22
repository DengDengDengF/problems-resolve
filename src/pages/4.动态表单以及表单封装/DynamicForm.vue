<template>
  <div>
    <h1>Select Example</h1>
    <select @change="handleSelectChange">
      <option v-for="option in list" :key="option.id" :value="option.val">
        {{ option.val }}
      </option>
    </select>
    <div style="display: flex;flex-direction: column" v-if="val.id !== '0'">
      <div style="display: flex">
        <input type="checkbox" id="option1_0" name="options" v-model="list_detail.one.zero">
        <label for="option1_0">Option 0</label><br>

        <input type="checkbox" id="option1_1" name="options" v-model="list_detail.one.one">
        <label for="option1_1">Option 1</label><br>
      </div>
      <div style="display: flex" v-if="val.id === '2'">
        <input type="checkbox" id="option2_0" name="options"  v-model="list_detail.two.zero">
        <label for="option2_0">Option 0</label><br>

        <input type="checkbox" id="option2_1" name="options" v-model="list_detail.two.one">
        <label for="option2_">Option 1</label><br>
      </div>
    </div>
  </div>
</template>


<script>
import {onMounted, reactive, ref} from "vue";
export default {
  name: "DynamicForm",
  setup(props) {
    const list = reactive([
      {
        id: '0',
        val: '不显示多选框',
      },
      {
        id: '1',
        val: '显示一个多选框',
      },
      {
        id: '2',
        val: '显示多个多选框',
      },
    ])
    const list_detail = reactive({
      'zero': null,
      'one': {
        'zero': false,
        'one': true,
      },
      'two': {
        'zero': true,
        'one': false
      }
    })
    let val = reactive({id: list[0].id, val: list[0].val});
    const handleSelectChange = function (event) {
      for (let i = 0; i < list.length; i++) {
        if (event.target.value === list[i].val) {
          val.id = list[i].id;
          val.val = list[i].val;
          break;
        }
      }
    }

    onMounted(() => {

    })
    return {
      list, list_detail, handleSelectChange, val
    }
  }
}
</script>


<style scoped>

</style>
