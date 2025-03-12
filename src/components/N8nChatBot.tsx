
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";

interface N8nChatBotProps {
  className?: string;
}

const N8nChatBot: React.FC<N8nChatBotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const webhookUrl = "https://n8n-tejkg.ondigitalocean.app/webhook/066ad635-ecfa-470c-8761-5d200b645136";

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.onload = () => {
        console.log('N8n Chat iframe loaded successfully');
      };
    }
  }, []);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const handleSend = async () => {
    if (message.trim()) {
      setIsLoading(true);
      try {
        // Send the message to the n8n webhook with the expected 'chatInput' parameter
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chatInput: message }),
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        console.log('Message sent successfully:', message);
        // Reset the input field after sending
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
        toast.error("Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
          <div className="w-[350px] h-[450px] overflow-auto bg-background p-4" id="chat-messages">
            {/* Chat messages will be displayed here */}
            <div className="text-center text-muted-foreground text-sm mb-4">
              Willkommen beim Cannabis Berater. Wie kann ich Ihnen heute helfen?
            </div>
          </div>
          <div className="p-3 border-t border-border bg-background">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Schreiben Sie eine Nachricht..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend}
                size="icon"
                variant="default"
                className="shrink-0"
                disabled={isLoading}
              >
                <Send size={18} className={isLoading ? "animate-pulse" : ""} />
              </Button>
            </div>
          </div>
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
