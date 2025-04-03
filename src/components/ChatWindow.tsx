// src/components/ChatWindow.tsx
import React, { useRef, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { ChatbotProps, Theme } from '../types';

interface ChatWindowProps extends ChatbotProps {
  isMaximized: boolean;
  onClose: () => void;
  onMaximize: () => void;
  chatSession: any; // Replace with proper type from useChatSession
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ 
  apiUrl, 
  chatboticon, 
  position, 
  theme, 
  isMaximized, 
  onClose, 
  onMaximize, 
  chatSession 
}) => {
  const chatContentRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContentRef.current) {
      chatContentRef.current.scrollTop = chatContentRef.current.scrollHeight;
    }
  }, [chatSession.messages]);

  // Get position style
  const getPositionStyle = () => {
    switch (position) {
      case "bottom-right":
        return { bottom: "20px", right: "10px" };
      case "bottom-left":
        return { bottom: "20px", left: "10px" };
      case "top-right":
        return { top: "20px", right: "10px" };
      case "top-left":
        return { top: "20px", left: "10px" };
      default:
        return { bottom: "20px", right: "20px" };
    }
  };

  // Window styles
  const chatWindowStyle = {
    width: isMaximized ? "90vw" : "320px", 
    height: isMaximized ? "90vh" : "70vh",
    maxWidth: isMaximized ? "800px" : "400px",
    maxHeight: isMaximized ? "90vh" : "700px",
    minWidth: "300px",
    minHeight: "400px",
    backgroundColor: theme.secondaryColor,
    color: theme.fontColor,
    position: "fixed",
    zIndex: 1001,
    display: "flex",
    opacity: 1,
    transition: "opacity 0.5s ease, width 0.3s ease, height 0.3s ease",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    borderRadius: "10px",
    flexDirection: "column",
    ...getPositionStyle(),
  } as React.CSSProperties;

  return (
    <div style={chatWindowStyle} className="chat-window">
      <ChatHeader 
        theme={theme} 
        onClose={onClose} 
        onMaximize={onMaximize}
        onRefresh={chatSession.showWelcomeMessage}
      />
      
      <ChatMessages 
        ref={chatContentRef}
        messages={chatSession.messages}
        chatboticon={chatboticon}
        theme={theme}
      />
      
      <ChatInput 
        input={chatSession.input}
        setInput={chatSession.setInput}
        sendMessage={chatSession.sendMessage}
        isWaitingForResponse={chatSession.isWaitingForResponse}
        theme={theme}
      />
    </div>
  );
};