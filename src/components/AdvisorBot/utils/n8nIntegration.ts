
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
    
    // Create a simplified version of conversation history to avoid potential circular references
    const simplifiedHistory = conversationHistory.slice(-5).map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    console.log("Conversation history:", simplifiedHistory);
    
    const requestPayload = {
      message: userMessage,
      conversation_history: simplifiedHistory,
      user_info: {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
        is_voice_chat: true
      },
      available_products: productKnowledgeBase,
    };
    
    // Log payload but limit the size to avoid console flooding
    console.log("Request payload:", JSON.stringify({
      ...requestPayload,
      available_products: `[${productKnowledgeBase.length} products]`
    }));
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      console.log("Starting fetch to webhook URL");
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Cache-Control": "no-cache"
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
        // Add these to avoid CORS issues
        mode: "cors",
        credentials: "omit"
      });
      
      clearTimeout(timeoutId);
      console.log("Received response from webhook:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Webhook error: ${response.status}`, errorText);
        throw new Error(`Webhook error: ${response.status} - ${errorText}`);
      }
      
      let responseText = await response.text();
      console.log("Raw response:", responseText.substring(0, 500) + (responseText.length > 500 ? '...' : ''));
      
      let data;
      
      try {
        data = JSON.parse(responseText);
        console.log("Parsed response data:", data);
      } catch (e) {
        console.log("Response is not JSON, using as plain text:", e);
        data = { message: responseText };
      }
      
      // In case of successful response but no message, provide a fallback
      if (!data.message && !data.response && !data.content) {
        console.warn("No message, response, or content field in the response");
        data.message = "Ich habe deine Anfrage erhalten, aber keine Antwort erhalten. Bitte versuche es noch einmal.";
      }
      
      // Always return a properly structured response
      return {
        botResponse: data.message || data.response || data.content || responseText,
        products: data.products || [],
        actions: data.actions || {}
      };
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        console.error("Webhook request timed out");
        toast({
          title: "Zeitüberschreitung",
          description: "Die Anfrage an den N8N-Webhook hat zu lange gedauert.",
          variant: "destructive",
        });
      } else {
        console.error("Fetch error in n8n webhook call:", fetchError);
        toast({
          title: "Verbindungsproblem",
          description: "Konnte keine Verbindung zum N8N-Webhook herstellen. Prüfe die URL und Netzwerkeinstellungen.",
          variant: "destructive",
        });
      }
      
      // Provide a fallback response for offline cases or server errors
      return {
        botResponse: "Entschuldigung, ich konnte keine Verbindung zum Server herstellen. Bitte überprüfe deine Internetverbindung oder versuche es später erneut.",
        products: [],
        actions: {}
      };
    }
  } catch (error) {
    console.error("Error in n8n webhook call:", error);
    setIsLoading(false);
    return {
      botResponse: "Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
      products: [],
      actions: {}
    };
  } finally {
    setIsLoading(false);
  }
};
