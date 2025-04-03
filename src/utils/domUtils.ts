import { ChatbotProps } from '../types';

export function createChatbot(element: HTMLElement, props: ChatbotProps) {
    // Implement chatbot creation logic here
    const chatbotContainer = document.createElement('div');
    chatbotContainer.className = 'chatbot-container';
    element.appendChild(chatbotContainer);
    return chatbotContainer;
}