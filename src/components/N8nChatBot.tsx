
import React from 'react';
import { cn } from '@/lib/utils';
import '@n8n/chat/style.css';
import { useChat } from './n8n-chat/useChat';
import { useDraggable } from './n8n-chat/useDraggable';
import { Grip } from 'lucide-react';

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
  
  // Make the chat window draggable
  const { position, elRef, handleMouseDown, isDragging } = useDraggable({ x: 0, y: 0 });
  
  return (
    <div 
      ref={elRef}
      className={cn('fixed bottom-6 right-6 z-50', className)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'box-shadow 0.3s ease',
        boxShadow: isDragging ? '0 8px 30px rgba(0, 0, 0, 0.2)' : '0 8px 24px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div 
        className="flex items-center justify-end bg-[#1A1F2C] rounded-t-lg px-2 py-1 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <Grip size={16} className="text-white/70 hover:text-white transition-colors" />
      </div>
      <div id="n8n-chat-container" className="h-[500px] w-[350px]"></div>
    </div>
  );
};

export default N8nChatBot;
