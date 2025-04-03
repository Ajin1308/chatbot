// src/types/index.ts
export type Position = "bottom-right" | "bottom-left" | "top-right" | "top-left" | "center";

export interface Theme {
  primaryColor: string;
  secondaryColor: string;
  terriaryColor: string;
  fontColor: string;
}

export interface Message {
  type: "user" | "bot" | "loading" | "link";
  content: string;
  agentType?: string;
  metadata?: any;
}

export interface ChatbotProps {
  apiUrl: string;
  boticon?: string;
  chatboticon?: string;
  position: Position;
  theme: Theme;
}