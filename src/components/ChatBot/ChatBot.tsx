
import React, { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import GDPRConsent from "./GDPRConsent";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gdprConsent, setGdprConsent] = useState<boolean>(
    localStorage.getItem("chatbot-gdpr-consent") === "true"
  );
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const webhookUrl = "https://n8n-tejkg.ondigitalocean.app/webhook/50aea9a1-9064-49c7-aea6-3a8714b26157";

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    // Add welcome message when chat is opened for the first time
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          text: "Hallo! Wie kann ich Ihnen heute helfen?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen, messages.length]);

  const handleGdprConsent = (consent: boolean) => {
    setGdprConsent(consent);
    localStorage.setItem("chatbot-gdpr-consent", consent.toString());
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      console.log("Sending to webhook:", webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          timestamp: new Date().toISOString(),
          sessionId: localStorage.getItem("chat-session-id") || Date.now().toString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from webhook");
      }

      const data = await response.json();
      
      // Add bot response
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: data.response || "Entschuldigung, ich konnte keine Antwort erhalten.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error sending message to webhook:", error);
      toast.error("Es gab ein Problem beim Senden Ihrer Nachricht.");
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "Entschuldigung, es gab ein Problem bei der Verarbeitung Ihrer Anfrage. Bitte versuchen Sie es später noch einmal.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50"
        size="icon"
      >
        <Bot className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 md:w-96 shadow-lg z-50 h-[500px] flex flex-col">
      <CardHeader className="bg-primary text-primary-foreground">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Chat Assistent
          </CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-primary/90"
          >
            &times;
          </Button>
        </div>
      </CardHeader>

      {!gdprConsent ? (
        <CardContent className="flex-1 overflow-auto py-4">
          <GDPRConsent onConsent={handleGdprConsent} />
        </CardContent>
      ) : (
        <>
          <CardContent className="flex-1 overflow-auto py-4 flex flex-col gap-3">
            <Alert variant="warning" className="mb-2">
              <AlertDescription className="text-xs">
                Ihre Kommunikation in diesem Chat wird gemäß DSGVO und HIPAA verarbeitet. Patient und Gesundheitsdaten werden verschlüsselt und mit FHIR-Standards gespeichert.
              </AlertDescription>
            </Alert>
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="border-t p-3">
            <div className="flex w-full gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Schreiben Sie eine Nachricht..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                size="icon"
                disabled={isLoading || !inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default ChatBot;
