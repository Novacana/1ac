
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import '@n8n/chat/style.css';
import { useChat } from './n8n-chat/useChat';
import { useDraggable } from './n8n-chat/useDraggable';
import { Grip, MinusCircle, PlusCircle } from 'lucide-react';

interface N8nChatBotProps {
  className?: string;
}

/**
 * N8nChatBot component
 * A chat widget that allows users to interact with a chatbot for medical cannabis consultations
 */
const N8nChatBot: React.FC<N8nChatBotProps> = ({ className }) => {
  const [minimized, setMinimized] = useState(false);
  
  // Use the chat hook to initialize and manage the chat widget
  useChat();
  
  // Make the chat window draggable
  const { position, elRef, handleMouseDown, isDragging } = useDraggable({ x: 0, y: 0 });
  
  return (
    <div 
      ref={elRef}
      className={cn('fixed bottom-6 right-6 z-[999]', className)}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isDragging ? 'none' : 'box-shadow 0.3s ease',
        boxShadow: isDragging ? '0 8px 30px rgba(0, 0, 0, 0.2)' : '0 8px 24px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div 
        className="flex items-center justify-between bg-primary rounded-t-lg px-3 py-2 cursor-move"
        onMouseDown={handleMouseDown}
      >
        <div className="font-semibold text-white ml-1">Cannabis Berater</div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMinimized(!minimized)}
            className="text-white/90 hover:text-white transition-colors"
          >
            {minimized ? <PlusCircle size={18} /> : <MinusCircle size={18} />}
          </button>
          <Grip size={16} className="text-white/70 hover:text-white transition-colors" />
        </div>
      </div>
      
      {!minimized && (
        <div 
          id="n8n-chat-container" 
          className={cn(
            "h-[500px] w-[350px]",
            "border border-t-0 border-gray-200 dark:border-gray-800 rounded-b-lg"
          )}
        ></div>
      )}
    </div>
  );
};

export default N8nChatBot;
