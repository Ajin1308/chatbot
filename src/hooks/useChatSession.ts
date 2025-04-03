// src/hooks/useChatSession.ts
import { useState, useRef, useEffect } from 'react';
import { Message, ChatbotProps } from '../types';
import { extractSpecificUrls, fetchLinkMetadata } from '../utils/urlExtractor';

export function useChatSession(props: ChatbotProps) {
  const [isWelcomeMessageShown, setIsWelcomeMessageShown] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const sessionId = useRef(`session_${Math.random().toString(36).substr(2, 9)}`);

  // Show welcome message
  const showWelcomeMessage = async () => {
    try {
      setIsWaitingForResponse(true);
      setMessages([]);
      
      const response = await fetch(props.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          message: "",
          session_id: sessionId.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setMessages([{ type: "bot", content: data.message, agentType: data.agent_type }]);
      setIsWelcomeMessageShown(true);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        {
          type: "bot",
          content: "Sorry, there was an error connecting to the service.",
          agentType: "error",
        },
      ]);
      setIsWelcomeMessageShown(true);
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  // Send message
  const sendMessage = async (messageText?: string) => {
    const userMessage = messageText || input.trim();
    
    if (userMessage === "" || isWaitingForResponse) return;
    
    if (!messageText) {
      setInput("");
    }

    // Add user message to chat
    setMessages((prev) => [...prev, { type: "user", content: userMessage }]);

    // Add loading indicator
    setMessages((prev) => [...prev, { type: "loading", content: "" }]);
    setIsWaitingForResponse(true);

    try {
      const response = await fetch(props.apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId.current,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Remove loading indicator and add bot message
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.type !== "loading");
        return [
          ...filtered,
          {
            type: "bot",
            content: data.message,
            agentType: data.agent_type,
          },
        ];
      });

      // Check for URLs in the message
      const urls = extractSpecificUrls(data.message);
      if (urls && urls.length > 0) {
        // Add loading indicator for link preview
        setMessages((prev) => [...prev, { type: "loading", content: "" }]);

        for (const url of urls) {
          const metadata = await fetchLinkMetadata(url);

          // Remove loading indicator and add link preview
          setMessages((prev) => {
            const filtered = prev.filter((msg) => msg.type !== "loading");
            if (metadata) {
              return [
                ...filtered,
                {
                  type: "link",
                  content: url,
                  metadata,
                },
              ];
            }
            return filtered;
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);

      // Remove loading indicator and add error message
      setMessages((prev) => {
        const filtered = prev.filter((msg) => msg.type !== "loading");
        return [
          ...filtered,
          {
            type: "bot",
            content: "Sorry, there was an error processing your request.",
            agentType: "error",
          },
        ];
      });
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    isWaitingForResponse,
    sendMessage,
    showWelcomeMessage
  };
}