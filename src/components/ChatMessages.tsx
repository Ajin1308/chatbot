// src/components/ChatMessages.tsx
import React, { forwardRef, useEffect, useState } from 'react';
import { marked } from 'marked';
import { LoadingIndicator } from './LoadingIndicator';
import { LinkPreview } from './LinkPreview';
import { Message, Theme } from '../types';
import { MessageBubble } from './MessaageBubble';

interface ChatMessagesProps {
  messages: Message[];
  chatboticon?: string;
  theme: Theme;
}

export const ChatMessages = forwardRef<HTMLDivElement, ChatMessagesProps>(
  ({ messages, chatboticon, theme }, ref) => {
    const [parsedMessages, setParsedMessages] = useState<Record<number, string>>({});

    useEffect(() => {
      const newParsedMessages: Record<number, string> = {};

      messages.forEach((message, index) => {
        if (message.type === "bot" && message.content) {
          try {
            newParsedMessages[index] = marked.parse(message.content) as string;
          } catch (error) {
            console.error("Error parsing markdown:", error);
            newParsedMessages[index] = message.content;
          }
        }
      });

      setParsedMessages(newParsedMessages);
    }, [messages]);

    return (
      <div
        ref={ref}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {messages.map((message, index) => {
          if (message.type === "user") {
            return (
              <MessageBubble 
                key={index} 
                type="user" 
                content={message.content} 
              />
            );
          } else if (message.type === "bot") {
            return (
              <MessageBubble 
                key={index} 
                type="bot" 
                content={parsedMessages[index] || message.content} 
                botIcon={chatboticon}
                isHtml={true}
              />
            );
          } else if (message.type === "loading") {
            return (
              <LoadingIndicator 
                key={index} 
                botIcon={chatboticon} 
                color={theme.primaryColor} 
              />
            );
          } else if (message.type === "link") {
            return (
              <LinkPreview 
                key={index} 
                url={message.content} 
                metadata={message.metadata} 
                botIcon={chatboticon} 
              />
            );
          }
          return null;
        })}
      </div>
    );
  }
);