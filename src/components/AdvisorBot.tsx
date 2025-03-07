
import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

// Sample product data (in a real app this would come from your database)
const products = [
  {
    id: "1",
    name: "Medical Cannabis Flower",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1603909223429-69bb7101f92e?q=80&w=2940&auto=format&fit=crop",
    category: "Flowers",
  },
  {
    id: "2",
    name: "CBD Oil Tincture",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1556928045-16f7f50be0f3?q=80&w=2787&auto=format&fit=crop",
    category: "Oils",
  },
  {
    id: "3",
    name: "THC Vape Cartridge",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1625657799852-21d67cc39319?q=80&w=2787&auto=format&fit=crop",
    category: "Vapes",
  },
  {
    id: "4",
    name: "Hemp-Infused Body Cream",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1607621048318-c2d5bdc0ee39?q=80&w=2940&auto=format&fit=crop",
    category: "Topicals",
  },
  {
    id: "5",
    name: "Cannabis-Infused Gummies",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1625517236224-4ab37a6425cb?q=80&w=2848&auto=format&fit=crop",
    category: "Edibles",
  }
];

const ProductAdvisor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hallo! Ich bin dein persönlicher Berater für medizinisches Cannabis. Wie kann ich dir heute helfen? Du kannst mich zu Produkten, Wirkungsweisen oder Anwendungsgebieten befragen.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const toggleAdvisor = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate AI response (in a real app, this would be an API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo responses based on user input keywords
      let botResponse = "";
      let recommendedProducts: Product[] = [];
      const userQuery = input.toLowerCase();
      
      if (userQuery.includes("schmerz") || userQuery.includes("pain")) {
        botResponse = "Für Schmerzpatienten empfehle ich folgende Produkte, die entzündungshemmend wirken oder bei stärkeren Schmerzen helfen können:";
        recommendedProducts = [products[0], products[1]]; // Cannabis Flower and CBD Oil
      } else if (userQuery.includes("schlaf") || userQuery.includes("sleep")) {
        botResponse = "Bei Schlafstörungen können diese Produkte besonders hilfreich sein:";
        recommendedProducts = [products[0], products[2]]; // Cannabis Flower and THC Vape
      } else if (userQuery.includes("angst") || userQuery.includes("anxiety")) {
        botResponse = "Gegen Angstzustände wirken folgende Produkte besonders gut:";
        recommendedProducts = [products[1], products[3]]; // CBD Oil and Body Cream
      } else if (userQuery.includes("appetit") || userQuery.includes("hunger")) {
        botResponse = "Diese Produkte können den Appetit anregen:";
        recommendedProducts = [products[0], products[4]]; // Cannabis Flower and Gummies
      } else if (userQuery.includes("thc")) {
        botResponse = "Hier sind unsere THC-haltigen Produkte:";
        recommendedProducts = [products[0], products[2], products[4]]; // Cannabis Flower, THC Vape, and Gummies
      } else if (userQuery.includes("cbd")) {
        botResponse = "Hier sind unsere CBD-haltigen Produkte:";
        recommendedProducts = [products[1], products[3]]; // CBD Oil and Body Cream
      } else if (userQuery.includes("produkt") || userQuery.includes("empfehl") || userQuery.includes("zeig")) {
        botResponse = "Hier sind einige unserer beliebtesten Produkte:";
        recommendedProducts = [...products]; // All products
      } else {
        botResponse = "Basierend auf deiner Anfrage könnte ich dir folgende Produkte empfehlen:";
        // Pick random 2 products
        const randomProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 2);
        recommendedProducts = randomProducts;
      }

      setMessages((prev) => [
        ...prev, 
        { 
          role: "assistant", 
          content: botResponse,
          products: recommendedProducts
        }
      ]);
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Entschuldigung, ich konnte deine Anfrage nicht verarbeiten. Bitte versuche es später noch einmal." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
          "fixed bottom-20 right-4 w-80 md:w-96 z-40 transition-all duration-300 transform",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
        )}
      >
        <Card className="border shadow-lg overflow-hidden flex flex-col h-[600px]">
          <div className="p-3 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-medium">Cannabis-Berater</span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleAdvisor} className="h-8 w-8 text-primary-foreground">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div 
                  className={cn(
                    "flex flex-col max-w-[85%] rounded-lg p-3", 
                    message.role === "assistant" 
                      ? "bg-secondary text-secondary-foreground self-start rounded-tl-none" 
                      : "bg-primary text-primary-foreground self-end rounded-br-none"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
                    {message.role === "assistant" ? (
                      <>
                        <Bot className="h-3 w-3" /> Berater
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3" /> Du
                      </>
                    )}
                  </div>
                  {message.content}
                </div>

                {/* Product recommendations */}
                {message.products && message.products.length > 0 && (
                  <div className="mt-2 grid gap-2 max-w-[90%]">
                    {message.products.map((product) => (
                      <Link 
                        to={`/product/${product.id}`}
                        key={product.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-all duration-200 animate-scale-in"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-secondary/20 shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                          <div className="flex justify-between items-center mt-0.5">
                            <span className="text-xs bg-secondary/40 px-1.5 py-0.5 rounded">{product.category}</span>
                            <span className="font-bold text-sm">€{product.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                      </Link>
                    ))}
                  </div>
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

          <div className="p-3 border-t bg-card">
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Frage zu Cannabis-Produkten..."
                className="min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                disabled={!input.trim() || isLoading}
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ProductAdvisor;
