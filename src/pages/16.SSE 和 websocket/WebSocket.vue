<template>
  <div>
    <input v-model="message" @keyup.enter="sendMessage" placeholder="Type a message...">
    <ul>
      <li v-for="(msg, index) in messages" :key="index">{{ msg }}</li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const message = ref('');
    const messages = ref([]);
    let socket = null;

    const connectWebSocket = () => {
      socket = new WebSocket('ws://localhost:5001/');

      socket.onmessage = (event) => {
        messages.value.push( "server value:"+event.data);
      };

      socket.onclose = () => {
        console.log('WebSocket closed.');
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    const sendMessage = () => {
      if (message.value.trim() !== '') {
        socket.send(message.value);
        messages.value.push(`You: ${message.value}`);
        message.value = '';
      }
    };

    // Connect WebSocket when component is mounted
    connectWebSocket();

    // Close WebSocket connection when component is unmounted
    const beforeUnmount = () => {
      if (socket) {
        socket.close();
      }
    };

    return {
      message,
      messages,
      sendMessage,
      beforeUnmount
    };
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 5px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 5px;
}
</style>
