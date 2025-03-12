
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ChatContainerProps {
  className?: string;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Add an observer to detect when the chat is rendered and apply additional styles if needed
    if (containerRef.current) {
      const observer = new MutationObserver((mutations) => {
        // Force any added n8n elements to use our styling
        const chatWindow = containerRef.current?.querySelector('.n8n-chat-window');
        if (chatWindow) {
          chatWindow.classList.add('custom-n8n-chat');
        }
      });
      
      observer.observe(containerRef.current, { 
        childList: true,
        subtree: true 
      });
      
      return () => observer.disconnect();
    }
  }, []);
  
  return (
    <div 
      id="n8n-chat-container" 
      ref={containerRef}
      className={cn("h-[500px] w-[350px] rounded-xl overflow-hidden shadow-lg", className)}
    />
  );
};

export default ChatContainer;
