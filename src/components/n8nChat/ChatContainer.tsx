
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatContainerProps {
  className?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ className }) => {
  return (
    <div id="n8n-chat-container" className="h-[500px] w-[350px]"></div>
  );
};

export default ChatContainer;
