
import { useState, useRef, useEffect } from "react";
import { Message, Product } from "@/types/advisor";

// Example product data
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

export const useAdvisorBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hallo! Ich bin dein persönlicher Berater für medizinisches Cannabis. Wie kann ich dir heute helfen? Du kannst mich zu Produkten, Wirkungsweisen oder Anwendungsgebieten befragen.",
      messageId: "welcome-message"
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = async (userInput: string) => {
    if (userInput.trim() === "" || isLoading) return;

    const userMessage = { role: "user" as const, content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let botResponse = "";
      let recommendedProducts: Product[] = [];
      const userQuery = userInput.toLowerCase();
      
      if (userQuery.includes("schmerz") || userQuery.includes("pain")) {
        botResponse = "Für Schmerzpatienten empfehle ich folgende Produkte, die entzündungshemmend wirken oder bei stärkeren Schmerzen helfen können:";
        recommendedProducts = [products[0], products[1]];
      } else if (userQuery.includes("schlaf") || userQuery.includes("sleep")) {
        botResponse = "Bei Schlafstörungen können diese Produkte besonders hilfreich sein:";
        recommendedProducts = [products[0], products[2]];
      } else if (userQuery.includes("angst") || userQuery.includes("anxiety")) {
        botResponse = "Gegen Angstzustände wirken folgende Produkte besonders gut:";
        recommendedProducts = [products[1], products[3]];
      } else if (userQuery.includes("appetit") || userQuery.includes("hunger")) {
        botResponse = "Diese Produkte können den Appetit anregen:";
        recommendedProducts = [products[0], products[4]];
      } else if (userQuery.includes("thc")) {
        botResponse = "Hier sind unsere THC-haltigen Produkte:";
        recommendedProducts = [products[0], products[2], products[4]];
      } else if (userQuery.includes("cbd")) {
        botResponse = "Hier sind unsere CBD-haltigen Produkte:";
        recommendedProducts = [products[1], products[3]];
      } else if (userQuery.includes("produkt") || userQuery.includes("empfehl") || userQuery.includes("zeig")) {
        botResponse = "Hier sind einige unserer beliebtesten Produkte:";
        recommendedProducts = [...products];
      } else {
        botResponse = "Basierend auf deiner Anfrage könnte ich dir folgende Produkte empfehlen:";
        const randomProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 2);
        recommendedProducts = randomProducts;
      }

      const messageId = `message-${Date.now()}`;
      const assistantMessage = {
        role: "assistant" as const,
        content: botResponse,
        products: recommendedProducts,
        messageId
      };

      setMessages((prev) => [...prev, assistantMessage]);
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

  return {
    messages,
    isLoading,
    bottomRef,
    handleSend
  };
};
