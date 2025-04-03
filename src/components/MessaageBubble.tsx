// src/components/MessageBubble.tsx
import React from 'react';

interface MessageBubbleProps {
  type: 'user' | 'bot';
  content: string;
  botIcon?: string;
  isHtml?: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ type, content, botIcon, isHtml = false }) => {
  if (type === 'user') {
    return (
      <div 
        className={`mb-2.5 bg-gray-100 p-2.5 rounded-xl ml-auto break-words border border-gray-300 ${
          content.length <= 20 ? 'w-auto' : 'max-w-[80%]'
        }`}
        style={{
          display: 'block',
          width: content.length <= 20 ? 'fit-content' : undefined,
        }}
      >
        {content}
      </div>
    );
  } else {
    return (
      <div className="flex items-start mb-2.5 gap-0">
        <img
          src={botIcon || "/placeholder.svg"}
          alt="Bot" 
          className="w-9 h-9 min-w-[33px] mt-2"
        />
        <div>
          <div 
            className="bg-blue-100/30 p-2.5 rounded-xl w-[80%] break-words border border-blue-200"
            {...(isHtml ? { dangerouslySetInnerHTML: { __html: content } } : { children: content })}
          />
        </div>
      </div>
    );
  }
};