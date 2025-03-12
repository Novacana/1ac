
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, X, Send, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";

interface N8nChatBotProps {
  className?: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const N8nChatBot: React.FC<N8nChatBotProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [gdprConsent, setGdprConsent] = useState<boolean>(
    localStorage.getItem('cannabis-chat-gdpr-consent') === 'true'
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const webhookUrl = "https://n8n-tejkg.ondigitalocean.app/webhook/066ad635-ecfa-470c-8761-5d200b645136";

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const giveGdprConsent = () => {
    localStorage.setItem('cannabis-chat-gdpr-consent', 'true');
    setGdprConsent(true);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    
    // Generate a unique ID for this message
    const msgId = Date.now().toString();
    
    // Add user message to the chat immediately
    const userMessage: ChatMessage = {
      id: msgId,
      text: message,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Save the message to clear the input
    const sentMessage = message;
    setMessage('');
    
    try {
      console.log('Sending message to webhook:', sentMessage);
      
      // Send the message to the n8n webhook with the expected 'chatInput' parameter
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          chatInput: sentMessage,
          userConsent: gdprConsent 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Try to get response data
      const responseData = await response.json().catch(() => null);
      
      // Add bot response if we got one
      if (responseData && responseData.response) {
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          text: responseData.response,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Add a fallback bot message if we didn't get a proper response
        const botMessage: ChatMessage = {
          id: Date.now().toString(),
          text: "Danke für Ihre Anfrage. Ich werde Ihnen gleich antworten.",
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error("Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.");
      
      // Add a system message about the error
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        text: "Es tut mir leid, aber ich kann im Moment nicht mit dem Server kommunizieren. Ihre Nachricht wurde gespeichert.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        variant="default"
        size="icon"
        className={cn(
          "fixed bottom-4 right-4 z-50 h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105",
          "animate-pulse"
        )}
      >
        <MessageCircle size={24} />
      </Button>
    );
  }

  return (
    <div className={cn('fixed bottom-4 right-4 z-50 flex flex-col items-end', className)}>
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
        
        {!gdprConsent ? (
          <div className="w-[350px] p-4 bg-background">
            <div className="bg-muted/50 p-4 rounded-lg mb-4 text-sm">
              <div className="flex items-start mb-2">
                <ShieldAlert className="h-5 w-5 mr-2 text-primary" />
                <h3 className="font-medium">Datenschutzhinweis</h3>
              </div>
              <p className="mb-3">
                Um Ihnen bestmöglich helfen zu können, werden Ihre Daten gemäß DSGVO und HIPAA verarbeitet. 
                Ihre Gesundheitsdaten werden verschlüsselt und nur für die Beratungszwecke verwendet.
              </p>
              <p className="mb-4 text-xs">
                Weitere Informationen finden Sie in unserer Datenschutzerklärung.
              </p>
              <Button 
                onClick={giveGdprConsent} 
                className="w-full"
                variant="default"
              >
                Ich stimme zu
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div 
              ref={chatContainerRef} 
              className="w-[350px] h-[450px] overflow-auto bg-background p-4" 
              id="chat-messages"
            >
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground text-sm mb-4">
                  Willkommen beim Cannabis Berater. Wie kann ich Ihnen heute helfen?
                </div>
              ) : (
                messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={cn(
                      "mb-3 p-3 rounded-lg max-w-[85%]",
                      msg.sender === 'user' 
                        ? "bg-primary text-primary-foreground ml-auto" 
                        : "bg-muted text-foreground"
                    )}
                  >
                    {msg.text}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
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
          </>
        )}
      </div>
      
      <Button
        onClick={toggleChat}
        variant="default"
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105"
      >
        <MessageCircle size={24} />
      </Button>
    </div>
  );
};

export default N8nChatBot;
