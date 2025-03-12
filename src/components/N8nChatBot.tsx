
import React from 'react';
import { cn } from '@/lib/utils';
import '@n8n/chat/style.css';
import { useChatInitialization } from './n8nChat/useChatInitialization';
import ChatContainer from './n8nChat/ChatContainer';

interface N8nChatBotProps {
  className?: string;
}

const N8nChatBot: React.FC<N8nChatBotProps> = ({ className }) => {
  const webhookUrl = "https://n8n-tejkg.ondigitalocean.app/webhook/066ad635-ecfa-470c-8761-5d200b645136/chat";
  
  // Initialize the chat using our custom hook
  useChatInitialization({ webhookUrl });

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      <ChatContainer />
    </div>
  );
};

export default N8nChatBot;
