// src/components/ChatHeader.tsx
import React from 'react';
import { XIcon } from 'lucide-react';
import { Theme } from '../types';

interface ChatHeaderProps {
  theme: Theme;
  onClose: () => void;
  onMaximize: () => void;
  onRefresh: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ theme, onClose, onMaximize, onRefresh }) => {
  return (
    <div className="h-[50px] flex items-center justify-between px-3 rounded-t-lg" style={{ backgroundColor: theme.primaryColor }}>
      {/* Chat Title */}
      <span className="text-[16px] font-bold" style={{ color: theme.secondaryColor }}>
        SmartShop AI
      </span>

      {/* Buttons Wrapper */}
      <div className="flex items-center gap-5">
        {/* Refresh Button */}
        <button
          className="cursor-pointer bg-transparent border-none flex items-center"
          onClick={onRefresh}
        >
          <img src="https://iili.io/3R6lEMP.md.png" alt="Refresh" className="w-[20px] h-[20px]" />
        </button>

        {/* Maximize/Minimize Button */}
        <button
          className="cursor-pointer bg-transparent border-none flex items-center"
          onClick={onMaximize}
        >
          <img src="https://iili.io/3R6OIm7.png" alt="Maximize/Minimize" className="w-[22px] h-[22px]" />
        </button>

        {/* Close Button */}
        <button
          className="cursor-pointer bg-transparent border-none flex items-center"
          onClick={onClose}
        >
          <XIcon size={24} style={{color: theme.secondaryColor}} />
        </button>
      </div>
    </div>
  );
};