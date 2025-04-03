import React from 'react';
import { Chatbot } from 'universal-chatbot';
import 'universal-chatbot/dist/chatbot.css';

function App() {
  return (
    <div className="App">
      <h1>Chatbot Example - React</h1>
      <p>This is a simple example of the chatbot integrated in a React application.</p>
      
      <Chatbot 
        apiUrl="https://your-api-endpoint.com/chat"
        position="bottom-right"
        theme={{
          primaryColor: "#4F46E5",
          secondaryColor: "#FFFFFF",
          terriaryColor: "#F3F4F6",
          fontColor: "#111827"
        }}
      />
    </div>
  );
}

export default App;