
import React, { useRef, useEffect } from "react";
import { Message as MessageType } from "./types";
import Message from "./Message";
import { User, Loader2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { ProductDetailProps } from "@/components/ProductDetail";

interface ConversationViewProps {
  conversationHistory: MessageType[];
  isPlaying: boolean;
  transcript: string;
  isLoading: boolean;
  recommendedProducts: ProductDetailProps[];
  showProducts: boolean;
  onProductClick: () => void;
}

const ConversationView: React.FC<ConversationViewProps> = ({
  conversationHistory,
  isPlaying,
  transcript,
  isLoading,
  recommendedProducts,
  showProducts,
  onProductClick
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationHistory, recommendedProducts, transcript, isLoading]);

  return (
    <div className="space-y-4">
      {conversationHistory.map((message, index) => (
        <Message 
          key={index} 
          message={message} 
          index={index} 
          isPlaying={isPlaying} 
          isLastMessage={index === conversationHistory.length - 1} 
        />
      ))}

      {transcript && (
        <div className="animate-fade-in">
          <div className="bg-primary text-primary-foreground self-end rounded-lg p-3 rounded-br-none ml-auto">
            <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
              <User className="h-3 w-3" /> Du
            </div>
            {transcript}
          </div>
        </div>
      )}

      {showProducts && recommendedProducts.length > 0 && (
        <div className="mt-2 grid gap-2 max-w-[90%]">
          {recommendedProducts.map((product) => (
            <Link 
              to={`/product/${product.id}`}
              key={product.id}
              className="flex items-center gap-3 p-2 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-all duration-200 animate-scale-in"
              onClick={onProductClick}
            >
              <div className="w-12 h-12 rounded-md overflow-hidden bg-secondary/20 shrink-0">
                <img 
                  src={product.images?.[0] || "/placeholder.svg"} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                <div className="flex justify-between items-center mt-0.5">
                  <span className="text-xs bg-secondary/40 px-1.5 py-0.5 rounded">{
                    product.category === "Blüten" ? "Blüten" : 
                    product.category === "Öle" ? "Öle" : 
                    product.category
                  }</span>
                  <span className="font-bold text-sm">€{product.price.toFixed(2)}</span>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
            </Link>
          ))}
        </div>
      )}

      {isLoading && (
        <div className="flex max-w-[85%] rounded-lg p-3 bg-secondary text-secondary-foreground self-start rounded-tl-none animate-pulse">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};

export default ConversationView;
