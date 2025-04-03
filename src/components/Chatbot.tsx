// src/components/Chatbot.tsx
import { useState, useEffect } from 'react';
import { ChatWindow } from './ChatWindow';
import { ChatButton } from './ChatButton';
import { InviteMessage } from './InviteMessage';
import { useChatSession } from '../hooks/useChatSession';
import { ChatbotProps } from '../types';

export function Chatbot(props: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showInviteMessage, setShowInviteMessage] = useState(true);
  const [isMaximized, setIsMaximized] = useState(false);
  
  const chatSession = useChatSession(props);
  
  useEffect(() => {
    chatSession.showWelcomeMessage();
  }, []);
  
  const toggleChat = () => setIsOpen(!isOpen);
  const toggleMaximize = () => setIsMaximized(!isMaximized);
  
  return (
    <>
      {!isOpen && showInviteMessage && (
        <InviteMessage 
          position={props.position}
          onClose={() => setShowInviteMessage(false)}
          onSelect={(option) => {
            setIsOpen(true);
            setShowInviteMessage(false);
            chatSession.sendMessage(option);
          }}
        />
      )}
      
      {!isOpen && (
        <ChatButton 
          botIcon={props.boticon}
          position={props.position}
          onClick={toggleChat}
        />
      )}
      
      {isOpen && (
        <ChatWindow
          {...props}
          isMaximized={isMaximized}
          onClose={toggleChat}
          onMaximize={toggleMaximize}
          chatSession={chatSession}
        />
      )}
    </>
  );
};

export default Chatbot;