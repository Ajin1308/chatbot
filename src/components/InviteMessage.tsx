// src/components/InviteMessage.tsx
import React from 'react';
import { Position } from '../types';
import { HelpCircle, Search, XIcon } from 'lucide-react';

interface InviteMessageProps {
  position: Position;
  onClose: () => void;
  onSelect: (option: string) => void;
}

export const InviteMessage: React.FC<InviteMessageProps> = ({ position, onClose, onSelect }) => {
  const getInviteMessagePosition = (): React.CSSProperties => {
    const style = {
      position: "fixed",
      zIndex: 999,
    } as React.CSSProperties;
  
    if (position === "bottom-right") {
      style.bottom = "120px";
      style.right = "50px";
    } else if (position === "bottom-left") {
      style.bottom = "110px";
      style.left = "35px";
    } else if (position === "top-right") {
      style.top = "110px";
      style.right = "35px";
    } else if (position === "top-left") {
      style.top = "110px";
      style.left = "35px";
    } else if (position === "center") {
      style.top = "calc(50% - 120px)";
      style.left = "50%";
      style.transform = "translateX(-50%)";
    }
  
    return style;
  };

  return (
    <div 
      className="p-4 animate-fadeIn max-w-[90%] sm:max-w-[400px] mx-auto"
      style={{ ...getInviteMessagePosition() } as React.CSSProperties}
    >
      {/* Chat Invite Box */}
      <div className="flex justify-between items-center bg-white rounded-lg shadow-xl p-2 sm:p-4 gap-3 border border-black">
        <h3 className="m-0 text-sm sm:text-md font-medium">
          Hi! What are you looking for?
        </h3>
        <button 
          className="bg-transparent border-none cursor-pointer text-gray-500 leading-none hover:text-gray-700 transition"
          onClick={onClose}
        >
          <XIcon size={20} color="black" />
        </button>
      </div>
      
      {/* Buttons Container */}
      <div className="flex justify-end sm:justify-start">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 w-40 sm:w-auto">
          {/* Find a Product Button */}
          <button 
            onClick={() => onSelect("Find a product")}
            className="flex items-center px-3 sm:px-4 py-2 bg-[#fff5f0] border border-black rounded-full shadow-lg cursor-pointer font-medium text-xs sm:text-sm md:text-base text-left hover:bg-[#ffe4d9] transition"
          >
            <Search size={18} className="mr-2" color="black" />
            Find a product
          </button>

          {/* Ask a Question Button */}
          <button 
            onClick={() => onSelect("Ask a question")}
            className="flex items-center px-3 sm:px-4 py-2 bg-[#fff5f0] border border-black rounded-full shadow-lg cursor-pointer font-medium text-xs sm:text-sm md:text-base text-left hover:bg-[#ffe4d9] transition"
          >
            <HelpCircle size={18} className="mr-2" color="black" />
            Ask a question
          </button>
        </div>
      </div>
    </div>
  );
};