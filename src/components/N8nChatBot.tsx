
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import '@n8n/chat/style.css';
import { useChat } from './n8n-chat/useChat';
import { useDraggable } from './n8n-chat/useDraggable';
import { Grip, MinusCircle, PlusCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface N8nChatBotProps {
  className?: string;
}

/**
 * N8nChatBot component
 * A chat widget that allows users to interact with a chatbot for medical cannabis consultations
 */
const N8nChatBot: React.FC<N8nChatBotProps> = ({ className }) => {
  // Get stored minimized state and position from localStorage to persist across page navigation
  const [minimized, setMinimized] = useState(() => {
    const storedMinimized = localStorage.getItem('chatMinimized');
    return storedMinimized ? JSON.parse(storedMinimized) : false;
  });
  
  const initialPosition = {
    x: parseInt(localStorage.getItem('chatPositionX') || '0'),
    y: parseInt(localStorage.getItem('chatPositionY') || '0')
  };

  // Use the chat hook to initialize and manage the chat widget
  useChat();
  
  // Make the chat window draggable
  const { position, elRef, handleMouseDown, isDragging } = useDraggable(initialPosition);
  
  // Track location changes to maintain state across navigation
  const location = useLocation();
  
  // Save minimized state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('chatMinimized', JSON.stringify(minimized));
  }, [minimized]);
  
  // Save position to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('chatPositionX', position.x.toString());
    localStorage.setItem('chatPositionY', position.y.toString());
  }, [position]);
  
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
