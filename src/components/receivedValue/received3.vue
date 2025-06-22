<template>
<div>
  <input type="text" :value="modelValue" @input="handleInput">
</div>
</template>

<script>
export default {
  name: "received3",
  props:{
     modelValue:{
       type: [String, Number],
       default: ''
     }
  },
  setup(props,context){
    const handleInput=(e)=>{
         context.emit('update:modelValue',e.target.value);
    }
    return{handleInput};
  }
}
</script>

<style scoped>

</style>