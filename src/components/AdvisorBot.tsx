
import { useState } from "react";
import { Bot, X, Loader2, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { VoiceProvider, useVoice } from "@/contexts/VoiceContext";
import { MessageBubble } from "@/components/advisor/MessageBubble";
import { ProductRecommendation } from "@/components/advisor/ProductRecommendation";
import { ChatInput } from "@/components/advisor/ChatInput";
import { useAdvisorBot } from "@/hooks/useAdvisorBot";

const AdvisorBotInner = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isVoiceEnabled, toggleVoice, stopSpeaking } = useVoice();
  const { messages, isLoading, bottomRef, handleSend } = useAdvisorBot();
  
  const toggleAdvisor = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      stopSpeaking();
    }
  };

  return (
    <>
      <Button
        onClick={toggleAdvisor}
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
        <Card className="border shadow-lg overflow-hidden flex flex-col h-[600px]">
          <div className="p-3 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-medium">1A Cannabis-Berater</span>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleVoice} 
                className="flex items-center gap-1 h-8 bg-primary/20 hover:bg-primary/30 border-primary/40 text-primary-foreground"
                title={isVoiceEnabled ? "Stimme ausschalten" : "Stimme einschalten"}
              >
                {isVoiceEnabled ? (
                  <>
                    <Volume2 className="h-4 w-4" />
                    <span className="text-xs">Stimme an</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="h-4 w-4" />
                    <span className="text-xs">Stimme aus</span>
                  </>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleAdvisor} 
                className="h-8 w-8 text-primary-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <MessageBubble message={message} />
                {message.products && (
                  <ProductRecommendation 
                    products={message.products} 
                    onProductClick={() => setIsOpen(false)} 
                  />
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex max-w-[85%] rounded-lg p-3 bg-secondary text-secondary-foreground self-start rounded-tl-none animate-pulse">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </Card>
      </div>
    </>
  );
};

const ProductAdvisor = () => {
  return (
    <VoiceProvider>
      <AdvisorBotInner />
    </VoiceProvider>
  );
};

export default ProductAdvisor;
