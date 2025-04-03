// src/adapters/vanilla.ts

import { ChatbotProps } from '../types';
import { createChatbot } from '../utils/domUtils';

export function initChatbot(element: HTMLElement, props: ChatbotProps) {
  return createChatbot(element, props);
}