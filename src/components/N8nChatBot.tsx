
import React from 'react';
import { cn } from '@/lib/utils';
import '@n8n/chat/style.css';
import { useChat } from './n8n-chat/useChat';
import ChatContainer from './chat/ChatContainer';

interface N8nChatBotProps {
  className?: string;
}

/**
 * N8nChatBot component
 * A chat widget that allows users to interact with a chatbot for medical cannabis consultations
 */
const N8nChatBot: React.FC<N8nChatBotProps> = ({ className }) => {
  // Use the chat hook to initialize and manage the chat widget
  useChat();

  return (
    <ChatContainer className={className}>
      <div id="n8n-chat-container" className="h-[500px] w-[350px] rounded-lg shadow-lg"></div>
    </ChatContainer>
  );
};

export default N8nChatBot;
