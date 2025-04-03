// src/adapters/react.tsx
import React from 'react';
import Chatbot from '../components/Chatbot';
import { ChatbotProps } from '../types';

export const ReactChatbot: React.FC<ChatbotProps> = (props) => {
  return <Chatbot {...props} />;
};