// src/components/ChatButton.tsx
import React from 'react';
import { Position } from '../types';

interface ChatButtonProps {
  botIcon?: string;
  position: Position;
  onClick: () => void;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ botIcon, position, onClick }) => {
  // Position styles based on the position prop
  const getPositionStyle = () => {
    const offset = "35px";
    switch (position) {
      case "bottom-right":
        return { bottom: offset, right: "10px" };
      case "bottom-left":
        return { bottom: offset, left: "10px" };
      case "top-right":
        return { top: offset, right: "10px" };
      case "top-left":
        return { top: offset, left: "10px" };
      default:
        return { bottom: offset, right: offset };
    }
  };

  return (
    <button
      style={{
        position: "fixed",
        width: "110px",
        height: "100px",
        zIndex: 1000,
        padding: 0,
        border: "none",
        background: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        ...getPositionStyle(),
      }}
      onClick={onClick}
    >
      <div
        style={{
          animation: "float 3s ease-in-out infinite",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={botIcon || "/placeholder.svg"}
          alt="Chatbot"
          className="rounded-full shadow-xl"
          style={{
            width: "70px",
            height: "70px",
            transition: "transform 0.3s ease",
          }}
        />
      </div>
    </button>
  );
};