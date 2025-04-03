// src/components/ChatInput.tsx
import React from 'react';
import { Theme } from '../types';

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  sendMessage: () => void;
  isWaitingForResponse: boolean;
  theme: Theme;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  input, 
  setInput, 
  sendMessage, 
  isWaitingForResponse,
  theme 
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px",
        backgroundColor: "#f5f5f5",
        borderBottomLeftRadius: "10px",
        borderBottomRightRadius: "10px",
      }}
    >
      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-1 py-2 px-4 border border-solid border-gray-300 rounded-full outline-none text-sm bg-white shadow-sm"
        disabled={isWaitingForResponse}
      />
      <button
        onClick={sendMessage}
        disabled={isWaitingForResponse || input.trim() === ""}
        style={{
          backgroundColor: theme.primaryColor,
          border: "none",
          padding: "6px 13px",
          borderRadius: "18px",
          marginLeft: "10px",
          cursor: isWaitingForResponse || input.trim() === "" ? "not-allowed" : "pointer",
          opacity: isWaitingForResponse || input.trim() === "" ? 0.7 : 1,
        }}
      >
        <img
          src="https://iili.io/3R6Ssbp.png"
          alt="Send"
          style={{
            width: "28px",
            height: "25px",
            marginRight: "2px",
          }}
        />
      </button>
    </div>
  );
};