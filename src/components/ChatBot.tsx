
import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, AlertTriangle, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import GDPRConsentModal from "./GDPRConsentModal";

// N8N webhook URL - updated to use the correct webhook
const N8N_WEBHOOK_URL = "https://n8n-tejkg.ondigitalocean.app/webhook/50aea9a1-9064-49c7-aea6-3a8714b26157";
const N8N_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlZGU0Yjk5MS1hNTZmLTQ5NjItOTBlNC0yYWQ2YzU1NmEyODAiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzQxNzE4ODA1LCJleHAiOjE3NDQyNTc2MDB9.vYTrVME7t9zzBlnMsK2p59gIlOIiEoHCabyIAMnzWJA";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "Wie kann ich Ihnen heute helfen? Fragen Sie mich gerne zu unseren Produkten und Dienstleistungen.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [hasGDPRConsent, setHasGDPRConsent] = useState(() => {
    return localStorage.getItem("chatbot-gdpr-consent") === "true";
  });
  const [showGDPRModal, setShowGDPRModal] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save GDPR consent to localStorage
  useEffect(() => {
    localStorage.setItem("chatbot-gdpr-consent", hasGDPRConsent.toString());
  }, [hasGDPRConsent]);

  const handleGDPRConsent = (consent: boolean) => {
    setHasGDPRConsent(consent);
    if (consent) {
      // If user consents, add a system message acknowledging the consent
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: "Danke für Ihre Zustimmung. Ihre Daten werden gemäß DSGVO und HIPAA verarbeitet.",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  };

  const toggleChat = () => {
    if (!isOpen && !hasGDPRConsent) {
      setShowGDPRModal(true);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !hasGDPRConsent) return;

    const userMessage = {
      role: "user" as const,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setConnectionError(null);
    setRetryCount(0);

    try {
      await sendToN8n(userMessage.content, sessionId);
    } catch (error) {
      console.error("Failed to send message:", error);
      handleSendError(error);
    }
  };

  const sendToN8n = async (message: string, sessionId: string, attempt = 1): Promise<void> => {
    try {
      console.log(`Attempt ${attempt} to send message to n8n webhook`);
      
      // Make sure we're using POST method as required by n8n
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST", // Always use POST for n8n webhooks
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${N8N_API_KEY}`,
          "Cache-Control": "no-cache",
        },
        body: JSON.stringify({
          message,
          timestamp: new Date().toISOString(),
          sessionId,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server responded with ${response.status}: ${errorText}`);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.response || "Ich habe Ihre Anfrage erhalten.",
          timestamp: new Date().toISOString(),
        },
      ]);
      
      setIsLoading(false);
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s, etc.
        const backoffTime = Math.pow(2, attempt - 1) * 1000;
        console.log(`Retrying in ${backoffTime}ms...`);
        
        setTimeout(() => {
          sendToN8n(message, sessionId, attempt + 1);
        }, backoffTime);
        
        setRetryCount(attempt);
      } else {
        throw error; // Let the calling function handle the error after max retries
      }
    }
  };

  const handleSendError = (error: any) => {
    console.error("Error in chat communication:", error);
    setIsLoading(false);
    
    // Add appropriate error message
    let errorMessage = "Es gab ein Problem bei der Verbindung. Bitte versuchen Sie es später erneut.";
    
    if (error instanceof TypeError && error.message.includes("fetch")) {
      errorMessage = "Verbindungsfehler: Der Server ist nicht erreichbar. Bitte überprüfen Sie Ihre Internetverbindung.";
      setConnectionError("network");
    } else if (error instanceof Error && error.message.includes("Server error")) {
      errorMessage = "Der Server konnte Ihre Anfrage nicht verarbeiten. Bitte versuchen Sie es später erneut.";
      setConnectionError("server");
    } else if (error instanceof Error && error.message.includes("timeout")) {
      errorMessage = "Die Anfrage hat zu lange gedauert. Bitte versuchen Sie es später erneut.";
      setConnectionError("timeout");
    }
    
    setMessages((prev) => [
      ...prev,
      {
        role: "system",
        content: errorMessage,
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  const retryLastMessage = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.role === "user");
    if (lastUserMessage) {
      setIsLoading(true);
      setConnectionError(null);
      setRetryCount(0);
      
      try {
        sendToN8n(lastUserMessage.content, sessionId);
      } catch (error) {
        handleSendError(error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getMessageClass = (role: string) => {
    switch (role) {
      case "user":
        return "bg-primary text-primary-foreground ml-auto";
      case "assistant":
        return "bg-muted text-foreground";
      case "system":
        return "bg-secondary/50 text-secondary-foreground text-sm";
      default:
        return "";
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
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>

      <GDPRConsentModal 
        isOpen={showGDPRModal} 
        onClose={() => setShowGDPRModal(false)} 
        onConsent={handleGDPRConsent} 
      />

      <div
        className={cn(
          "fixed bottom-20 right-4 w-80 md:w-96 z-[100] transition-all duration-300 transform",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
        )}
      >
        <Card className="border shadow-lg overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-3">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-medium">Kundenservice Chat</h3>
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="h-80 overflow-y-auto p-4 space-y-3">
              {!hasGDPRConsent && (
                <Alert className="mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Bitte stimmen Sie unseren Datenschutzbestimmungen zu, bevor Sie den Chat nutzen.
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-xs underline"
                      onClick={() => setShowGDPRModal(true)}
                    >
                      Datenschutzhinweis anzeigen
                    </Button>
                  </AlertDescription>
                </Alert>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    "px-3 py-2 rounded-lg max-w-[85%]",
                    getMessageClass(msg.role)
                  )}
                >
                  <div className="break-words">{msg.content}</div>
                  {msg.timestamp && (
                    <div className="text-xs opacity-60 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
                  <span>
                    {retryCount > 0 
                      ? `Verbindungsversuch ${retryCount}/${maxRetries}...` 
                      : "Nachricht wird verarbeitet..."}
                  </span>
                </div>
              )}

              {connectionError && (
                <div className="text-center py-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs" 
                    onClick={retryLastMessage}
                    disabled={isLoading}
                  >
                    Verbindung wiederherstellen
                  </Button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          <CardFooter className="p-3 border-t bg-background">
            <div className="flex w-full space-x-2">
              <Input
                placeholder={hasGDPRConsent ? "Nachricht eingeben..." : "Bitte stimmen Sie den Datenschutzbestimmungen zu"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading || !hasGDPRConsent}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                size="icon"
                disabled={isLoading || !input.trim() || !hasGDPRConsent}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default ChatBot;
