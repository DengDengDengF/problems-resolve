<template>
  <div>
    {{ message }}
    <button @click="change">change</button>
  </div>
</template>


<script>
export default {
  name: "demoTest",
  props: {
    message: {
      type: String,
      required: false,
    }
  },
  setup(props, {emit}) {
    const change = () => {
      emit('changeMessage')
    }
    return {
      change,
    }
  }

}
</script>


<style scoped>

</style>
