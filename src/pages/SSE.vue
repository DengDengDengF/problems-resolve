<template>
  <div>{{ message }}</div>
</template>


<script>
import {ref} from "vue";

export default {
  name: "SSE",
  setup() {
    //接口用python写的，SSE(Server-Sent-Events)流功能。
    const message = ref('');
    const eventSource = new EventSource('http://localhost:5000/stream');
    eventSource.onmessage = (event) => {
      message.value += event.data;
    }
    return {message}
  }
}
</script>


<style scoped>

</style>
