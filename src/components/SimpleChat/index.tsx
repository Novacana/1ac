
import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const N8N_WEBHOOK_URL = "https://n8n-tejkg.ondigitalocean.app/webhook/50aea9a1-9064-49c7-aea6-3a8714b26157";

const SimpleChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hallo! Wie kann ich dir helfen?" }
  ]);
  
  const messagesRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Scroll to bottom effect
  useEffect(() => {
    if (messagesRef.current && bottomRef.current && isOpen) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const userMessage = userInput.trim();
    setUserInput("");
    
    // Add user message to conversation
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    
    try {
      // Create the payload for n8n
      const payload = {
        message: userMessage,
        conversation_history: messages.slice(-5),
        user_info: {
          page: window.location.pathname,
          timestamp: new Date().toISOString()
        }
      };
      
      console.log("Sending to n8n webhook:", N8N_WEBHOOK_URL);
      console.log("Payload:", payload);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const responseText = await response.text();
      let botMessage: string;
      
      try {
        const responseData = JSON.parse(responseText);
        console.log("Response data:", responseData);
        botMessage = responseData.message || responseData.response || responseData.content;
      } catch (e) {
        console.log("Response is not JSON, using as plain text:", responseText);
        botMessage = responseText;
      }
      
      if (!botMessage) {
        throw new Error("Invalid response format");
      }
      
      // Add bot message to conversation
      setMessages(prev => [...prev, { role: 'assistant', content: botMessage }]);
      
    } catch (error) {
      console.error("Error sending message:", error);
      
      let errorMessage = "Es ist ein Fehler bei der Kommunikation aufgetreten.";
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = "Die Verbindung hat zu lange gedauert. Bitte versuche es erneut.";
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = "Konnte keine Verbindung zum Server herstellen. Bitte überprüfe deine Internetverbindung.";
        }
      }
      
      toast({
        title: "Fehler",
        description: errorMessage,
        variant: "destructive"
      });
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-4 right-4 rounded-full shadow-lg z-50 transition-all duration-300",
          isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
        )}
        size="icon"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </Button>

      <div
        className={cn(
          "fixed bottom-20 right-4 w-80 md:w-96 z-[100] transition-all duration-300 transform",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
        )}
      >
        <Card className="border shadow-lg overflow-hidden flex flex-col h-[500px]">
          <div className="p-3 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-medium">Chat</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleChat} 
              className="h-8 w-8 text-primary-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesRef}>
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={cn(
                  "max-w-[85%]",
                  message.role === 'user' ? "ml-auto" : ""
                )}
              >
                <div className={cn(
                  "rounded-lg p-3",
                  message.role === 'user' 
                    ? "bg-primary text-primary-foreground self-end rounded-br-none" 
                    : "bg-secondary text-secondary-foreground self-start rounded-tl-none"
                )}>
                  {message.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex max-w-[85%] rounded-lg p-3 bg-secondary text-secondary-foreground self-start rounded-tl-none animate-pulse">
                <div className="flex gap-1">
                  <span className="inline-block h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="inline-block h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="inline-block h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
            
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t bg-card">
            <div className="flex gap-2">
              <Input
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Schreibe eine Nachricht..."
                className="flex-1"
                disabled={isLoading}
              />
              
              <Button
                disabled={!userInput.trim() || isLoading}
                onClick={handleSendMessage}
                size="icon"
                className="shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default SimpleChat;
