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
  
  console.log("Executing n8n actions:", actions);
  
  if (actions.navigate_to) {
    setTimeout(() => {
      console.log("Navigating to:", actions.navigate_to);
      setIsOpen(false);
      navigate(actions.navigate_to);
    }, 1000);
  }
  
  if (actions.add_to_cart) {
    const { product_id, quantity = 1 } = actions.add_to_cart;
    const product = products.find(p => p.id === product_id);
    
    if (product) {
      console.log("Adding to cart:", product.name, quantity);
      toast({
        title: "Produkt zum Warenkorb hinzugefügt",
        description: `${quantity}x ${product.name} wurde zum Warenkorb hinzugefügt.`,
      });
    }
  }
  
  if (actions.custom_action) {
    console.log("Executing custom action:", actions.custom_action);
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
  if (!webhookUrl || !useN8nAgent) {
    console.error("N8n integration disabled or webhook URL missing", { useN8nAgent, webhookUrl });
    return null;
  }
  
  try {
    setIsLoading(true);
    console.log("Sending request to n8n webhook:", webhookUrl);
    console.log("Message:", userMessage);
    console.log("Conversation history:", conversationHistory);
    
    const requestPayload = {
      message: userMessage,
      conversation_history: conversationHistory.slice(-5), // Send last 5 messages for context
      user_info: {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        is_voice_chat: true
      },
      available_products: productKnowledgeBase,
    };
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(requestPayload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Webhook error: ${response.status}`);
    }
    
    let responseText = await response.text();
    let data;
    
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.log("Response is not JSON, using as plain text");
      data = { message: responseText };
    }
    
    // Always return a properly structured response
    return {
      botResponse: data.message || data.response || data.content || responseText,
      products: data.products || [],
      actions: data.actions || {}
    };
    
  } catch (error) {
    console.error("Error in n8n webhook call:", error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};
