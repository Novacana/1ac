
import { NavigateFunction } from "react-router-dom";
import { ProductDetailProps } from "@/components/ProductDetail";
import { products } from "@/data/products";
import { ToastFunction } from "../types";

export const executeN8nActions = (
  actions: any,
  navigate: NavigateFunction,
  toast: any,
  setIsOpen: (isOpen: boolean) => void
) => {
  if (!actions) return;
  
  if (actions.navigate_to) {
    setTimeout(() => {
      setIsOpen(false);
      navigate(actions.navigate_to);
    }, 1000);
  }
  
  if (actions.add_to_cart) {
    const { product_id, quantity = 1 } = actions.add_to_cart;
    const product = products.find(p => p.id === product_id);
    
    if (product) {
      toast({
        title: "Produkt zum Warenkorb hinzugefügt",
        description: `${quantity}x ${product.name} wurde zum Warenkorb hinzugefügt.`,
      });
    }
  }
  
  if (actions.custom_action) {
    console.log("Führe benutzerdefinierte Aktion aus:", actions.custom_action);
  }
};

export const sendToN8nWebhook = async (
  userMessage: string,
  webhookUrl: string,
  useN8nAgent: boolean,
  conversationHistory: { role: 'user' | 'assistant', content: string }[],
  productKnowledgeBase: any[],
  setIsLoading: (loading: boolean) => void,
  toast: ToastFunction
): Promise<{
  botResponse: string;
  products: ProductDetailProps[];
  actions: any;
} | null> => {
  if (!webhookUrl || !useN8nAgent) return null;
  
  try {
    setIsLoading(true);
    console.log("Sending request to n8n webhook:", webhookUrl);
    console.log("Request payload:", {
      message: userMessage,
      conversation_history: conversationHistory,
      products_count: productKnowledgeBase.length
    });
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        conversation_history: conversationHistory,
        user_info: {
          page: window.location.pathname,
          timestamp: new Date().toISOString()
        },
        available_products: productKnowledgeBase,
      }),
    });
    
    console.log("n8n webhook response status:", response.status);
    
    if (!response.ok) {
      throw new Error(`Webhook responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Response from n8n webhook:", data);
    
    return {
      botResponse: data.message || "Ich konnte keine Antwort vom n8n-Agenten erhalten.",
      products: data.products || [],
      actions: data.actions || {}
    };
  } catch (error) {
    console.error("Error communicating with n8n:", error);
    toast({
      title: "Fehler bei der n8n-Kommunikation",
      description: "Es gab ein Problem mit dem n8n Webhook.",
      variant: "destructive",
    });
    return null;
  } finally {
    setIsLoading(false);
  }
};
