
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface N8nChatBotProps {
  className?: string;
}

const N8nChatBot: React.FC<N8nChatBotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Ensure the iframe loads securely
    if (iframeRef.current) {
      iframeRef.current.onload = () => {
        console.log('N8n Chat iframe loaded successfully');
      };
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className={cn('fixed bottom-4 right-4 z-50 flex flex-col items-end', className)}>
      {isOpen && (
        <div className="mb-4 bg-background rounded-lg shadow-lg overflow-hidden animate-scale-in border border-border">
          <div className="flex items-center justify-between bg-primary p-3">
            <span className="text-primary-foreground font-medium">Cannabis Berater</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-primary-foreground hover:bg-primary/80"
              onClick={toggleChat}
            >
              <X size={18} />
            </Button>
          </div>
          <iframe
            ref={iframeRef}
            src="https://n8n-tejkg.ondigitalocean.app/webhook/066ad635-ecfa-470c-8761-5d200b645136/chat"
            className="w-[350px] h-[500px] border-0"
            title="Cannabis Berater Chat"
          />
        </div>
      )}
      
      <Button
        onClick={toggleChat}
        variant="default"
        size="icon"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105",
          !isOpen && "animate-pulse"
        )}
      >
        <MessageCircle size={24} />
      </Button>
    </div>
  );
};

export default N8nChatBot;
