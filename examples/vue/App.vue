<template>
  <div class="app">
    <h1>Chatbot Example - Vue</h1>
    <p>This is a simple example of the chatbot integrated in a Vue application.</p>
    
    <div ref="chatbotContainer"></div>
  </div>
</template>

<script>
import { Chatbot } from 'universal-chatbot';
import 'universal-chatbot/dist/chatbot.css';

export default {
  name: 'App',
  mounted() {
    // Initialize the chatbot
    Chatbot.init(this.$refs.chatbotContainer, {
      apiUrl: 'https://your-api-endpoint.com/chat',
      position: 'bottom-right',
      theme: {
        primaryColor: "#4F46E5",
        secondaryColor: "#FFFFFF",
        terriaryColor: "#F3F4F6",
        fontColor: "#111827"
      }
    });
  }
}
</script>