
import React, { useRef, useEffect } from "react";
import { Loader2, Bot } from "lucide-react";
import ConversationMessage from "./ConversationMessage";
import ProductSuggestions from "./ProductSuggestions";
import QuickActionTools from "./QuickActionTools";
import { Message } from "./types";
import { ProductDetailProps } from "@/components/ProductDetail";

interface ConversationHistoryProps {
  conversationHistory: Message[];
  isPlaying: boolean;
  transcript: string;
  isLoading: boolean;
  recommendedProducts: ProductDetailProps[];
  showProducts: boolean;
  onActionClick: (query: string) => void;
  onNavigate: (path: string) => void;
  onProductClick: () => void;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({
  conversationHistory,
  isPlaying,
  transcript,
  isLoading,
  recommendedProducts,
  showProducts,
  onActionClick,
  onNavigate,
  onProductClick,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationHistory, recommendedProducts]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesRef}>
      <div className="flex flex-col items-center justify-center text-center mb-4">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
          <Bot className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-medium">Cannabis-Berater (KI)</h3>
        <p className="text-sm text-muted-foreground">Sprich mit mir über Cannabis-Produkte</p>
      </div>

      {/* Quick Action Tools */}
      <QuickActionTools 
        onActionClick={onActionClick}
        onNavigate={onNavigate}
      />

      {/* Conversation history */}
      <div className="space-y-4">
        {conversationHistory.map((message, index) => (
          <ConversationMessage
            key={index}
            message={message}
            index={index}
            isPlaying={isPlaying}
            isLastMessage={index === conversationHistory.length - 1}
          />
        ))}
      </div>

      {/* User input display */}
      {transcript && (
        <div className="animate-fade-in">
          <div className="bg-primary text-primary-foreground self-end rounded-lg p-3 rounded-br-none ml-auto">
            <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
              <Bot className="h-3 w-3" /> Du
            </div>
            {transcript}
          </div>
        </div>
      )}

      {/* Products display */}
      <ProductSuggestions
        showProducts={showProducts}
        recommendedProducts={recommendedProducts}
        onProductClick={onProductClick}
      />

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex max-w-[85%] rounded-lg p-3 bg-secondary text-secondary-foreground self-start rounded-tl-none animate-pulse">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ConversationHistory;
