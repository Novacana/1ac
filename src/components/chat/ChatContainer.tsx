
import React, { useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * ChatContainer component
 * A wrapper for the chat widget that provides minimize/maximize functionality
 */
const ChatContainer: React.FC<ChatContainerProps> = ({ children, className }) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={cn('fixed bottom-6 right-6 z-50 flex flex-col', className)}>
      <div className="self-end mb-2">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleMinimize}
          className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
          aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
        >
          {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className={cn(
        'transition-all duration-300 ease-in-out origin-bottom-right',
        isMinimized ? 'scale-0 opacity-0 h-0 w-0 overflow-hidden' : 'scale-100 opacity-100'
      )}>
        {children}
      </div>
    </div>
  );
};

export default ChatContainer;
