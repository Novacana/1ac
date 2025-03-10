
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
    console.log("N8n integration is disabled or webhook URL is missing", { useN8nAgent, webhookUrl });
    return null;
  }
  
  try {
    setIsLoading(true);
    console.log(`Sending request to n8n webhook: ${webhookUrl}`);
    
    // Debug what we're sending
    const requestPayload = {
      message: userMessage,
      conversation_history: conversationHistory,
      user_info: {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        is_voice_chat: true // Indicate that this is coming from voice chat
      },
      available_products: productKnowledgeBase,
    };
    
    console.log("Request payload to n8n:", JSON.stringify(requestPayload, null, 2));
    
    // Create an AbortController for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15-second timeout
    
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
    
    console.log("n8n webhook response status:", response.status);
    
    if (!response.ok) {
      console.error("Webhook error with status:", response.status);
      let errorText = "";
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = "Konnte keine Fehlerdetails abrufen";
      }
      console.error("Error details:", errorText);
      throw new Error(`Webhook responded with status: ${response.status}`);
    }
    
    // Try to parse response as JSON first
    let data;
    let responseText = await response.text();
    console.log("Raw response from n8n webhook:", responseText);
    
    try {
      data = JSON.parse(responseText);
      console.log("Parsed JSON response from n8n webhook:", data);
    } catch (e) {
      console.log("Response is not valid JSON, using as plain text");
      data = { message: responseText };
    }
    
    // Ensure we have a message property in the response
    if (!data.message) {
      if (typeof data === 'string') {
        // If data is a string itself, use it as the message
        return {
          botResponse: data,
          products: [],
          actions: {}
        };
      } else if (typeof data === 'object') {
        // Try to extract a message from the object if possible
        const possibleMessage = data.text || data.response || data.content || JSON.stringify(data);
        return {
          botResponse: possibleMessage,
          products: data.products || [],
          actions: data.actions || {}
        };
      }
    }
    
    return {
      botResponse: data.message || "Ich konnte keine Antwort vom n8n-Agenten erhalten.",
      products: data.products || [],
      actions: data.actions || {}
    };
  } catch (error) {
    console.error("Error communicating with n8n:", error);
    if (error.name === 'AbortError') {
      toast({
        title: "Zeitüberschreitung beim n8n Webhook",
        description: "Der n8n-Agent hat nicht rechtzeitig geantwortet. Bitte versuche es später erneut.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Fehler bei der n8n-Kommunikation",
        description: `Es gab ein Problem mit dem n8n Webhook: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`,
        variant: "destructive",
      });
    }
    return null;
  } finally {
    setIsLoading(false);
  }
};
