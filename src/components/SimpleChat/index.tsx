
import React, { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  sendMessageToN8N, 
  ChatMessage, 
  setN8nApiKey, 
  getN8nApiKey 
} from "@/integrations/n8n/api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const SimpleChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hallo! Wie kann ich dir helfen?" }
  ]);
  const [apiKey, setApiKey] = useState(() => getN8nApiKey());
  
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
      // Send the message to n8n using our new API integration
      const botResponse = await sendMessageToN8N(userMessage, messages);
      
      // Add bot message to conversation
      setMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
      
    } catch (error) {
      console.error("Error in chat interaction:", error);
      
      // Error already handled and toasted in the API function
      // Just add error message to the conversation
      let errorMessage = "Es ist ein Fehler bei der Kommunikation aufgetreten.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
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

  // Handle API key update
  const handleSaveApiKey = () => {
    setN8nApiKey(apiKey);
    toast({
      title: "API-Schlüssel gespeichert",
      description: "Der n8n API-Schlüssel wurde aktualisiert.",
    });
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
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-primary-foreground"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <h4 className="font-medium">API-Einstellungen</h4>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="n8n-api-key">
                        n8n API-Schlüssel
                      </label>
                      <Input
                        id="n8n-api-key"
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Gib deinen API-Schlüssel ein"
                      />
                      <p className="text-xs text-muted-foreground">
                        Der API-Schlüssel wird für die Kommunikation mit n8n benötigt.
                      </p>
                      <Button onClick={handleSaveApiKey} className="mt-2 w-full">
                        Speichern
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleChat} 
                className="h-8 w-8 text-primary-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
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
