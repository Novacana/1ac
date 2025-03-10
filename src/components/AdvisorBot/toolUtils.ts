
import { NavigateFunction } from "react-router-dom";
import { products } from "@/data/products";
import { ProductDetailProps } from "@/components/ProductDetail";
import { ToolIntent, WebTools } from "./types";
import { ToastAction } from "@/components/ui/toast";

export const createWebTools = (
  navigate: NavigateFunction,
  toast: any
): WebTools => {
  return {
    navigateToPage: (page: string) => {
      let route = '';
      
      if (page.toLowerCase().includes('home') || page === '/') {
        route = '/';
      } else if (page.toLowerCase().includes('product') && !page.includes('/')) {
        route = '/products';
      } else if (page.toLowerCase().includes('cart') || page.toLowerCase().includes('warenkorb')) {
        route = '/cart';
      } else if (page.toLowerCase().includes('checkout') || page.toLowerCase().includes('kasse')) {
        route = '/checkout';
      } else {
        route = page;
      }
      
      setTimeout(() => {
        navigate(route);
      }, 1000);
      
      return `Ich navigiere zu ${route}`;
    },
    
    searchProducts: (query: string) => {
      const lowerQuery = query.toLowerCase();
      let matchedProducts = products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        (p.strain && p.strain.toLowerCase().includes(lowerQuery)) ||
        (p.category && p.category.toLowerCase().includes(lowerQuery)) ||
        (p.effects && p.effects.some(e => e.toLowerCase().includes(lowerQuery))) ||
        (p.benefits && p.benefits.some(b => b.toLowerCase().includes(lowerQuery))) ||
        (p.terpenes && p.terpenes.some(t => t.name.toLowerCase().includes(lowerQuery)))
      );
      
      if (matchedProducts.length > 3) {
        matchedProducts = matchedProducts.slice(0, 3);
      }
      
      return `Ich habe ${matchedProducts.length} Produkte gefunden, die zu "${query}" passen.`;
    },
    
    showProductDetails: (productId: string | number) => {
      const id = typeof productId === 'number' ? productId : productId;
      const product = products.find(p => p.id === id);
      
      if (product) {
        setTimeout(() => {
          navigate(`/product/${id}`);
        }, 1000);
        return `Ich zeige dir Details zu ${product.name}`;
      }
      
      return "Ich konnte dieses Produkt nicht finden.";
    },
    
    addToCart: (productId: string | number, quantity: number = 1) => {
      const id = typeof productId === 'number' ? productId : productId;
      const product = products.find(p => p.id === id);
      
      if (product) {
        toast({
          title: "Produkt zum Warenkorb hinzugefügt",
          description: `${quantity}x ${product.name} wurde zum Warenkorb hinzugefügt.`,
        });
        
        return `Ich habe ${quantity}x ${product.name} zum Warenkorb hinzugefügt.`;
      }
      
      return "Ich konnte dieses Produkt nicht finden.";
    }
  };
};

export const detectToolIntent = (message: string): ToolIntent | null => {
  const lowerMessage = message.toLowerCase();
  
  if (
    lowerMessage.includes('geh zu') || 
    lowerMessage.includes('zeig mir die') || 
    lowerMessage.includes('navigiere zu') || 
    lowerMessage.includes('öffne') ||
    lowerMessage.includes('zur seite')
  ) {
    if (lowerMessage.includes('startseite') || lowerMessage.includes('homepage')) {
      return { tool: 'navigateToPage', params: '/' };
    }
    if (lowerMessage.includes('produkt') && !lowerMessage.includes('produkte')) {
      const productIdMatch = lowerMessage.match(/produkt\s+(\d+)/i);
      if (productIdMatch && productIdMatch[1]) {
        return { tool: 'showProductDetails', params: productIdMatch[1] };
      }
    }
    if (lowerMessage.includes('produkte') || lowerMessage.includes('produktseite')) {
      return { tool: 'navigateToPage', params: '/products' };
    }
    if (lowerMessage.includes('warenkorb') || lowerMessage.includes('cart')) {
      return { tool: 'navigateToPage', params: '/cart' };
    }
    if (lowerMessage.includes('kasse') || lowerMessage.includes('checkout')) {
      return { tool: 'navigateToPage', params: '/checkout' };
    }
  }
  
  if (
    lowerMessage.includes('such') || 
    lowerMessage.includes('find') || 
    lowerMessage.includes('zeig mir produkte für')
  ) {
    let searchQuery = "";
    if (lowerMessage.includes('für')) {
      const parts = lowerMessage.split('für');
      if (parts.length > 1) {
        searchQuery = parts[1].trim();
      }
    } else if (lowerMessage.includes('zu')) {
      const parts = lowerMessage.split('zu');
      if (parts.length > 1) {
        searchQuery = parts[1].trim();
      }
    } else if (lowerMessage.includes('nach')) {
      const parts = lowerMessage.split('nach');
      if (parts.length > 1) {
        searchQuery = parts[1].trim();
      }
    } else {
      const keywords = ['schmerz', 'schlaf', 'angst', 'appetit', 'fokus', 'energie', 'entspannung', 'indica', 'sativa', 'hybrid'];
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          searchQuery = keyword;
          break;
        }
      }
    }
    
    if (searchQuery) {
      return { tool: 'searchProducts', params: searchQuery };
    }
  }
  
  if (
    lowerMessage.includes('zum warenkorb hinzufügen') || 
    lowerMessage.includes('in den warenkorb') || 
    lowerMessage.includes('kaufen') ||
    lowerMessage.includes('bestellen')
  ) {
    const productIdMatch = lowerMessage.match(/produkt\s+(\d+)/i);
    const quantityMatch = lowerMessage.match(/(\d+)\s*stück/i);
    
    if (productIdMatch && productIdMatch[1]) {
      const productId = productIdMatch[1];
      const quantity = quantityMatch && quantityMatch[1] ? parseInt(quantityMatch[1]) : 1;
      return { tool: 'addToCart', params: { productId, quantity } };
    }
  }
  
  if (
    lowerMessage.includes('details zu produkt') || 
    lowerMessage.includes('mehr über produkt') || 
    lowerMessage.includes('information zu produkt')
  ) {
    const productIdMatch = lowerMessage.match(/produkt\s+(\d+)/i);
    if (productIdMatch && productIdMatch[1]) {
      return { tool: 'showProductDetails', params: productIdMatch[1] };
    }
  }
  
  return null;
};

export const processQuery = (
  userQuery: string,
  setRecommendedProducts: (products: ProductDetailProps[]) => void,
  setShowProducts: (show: boolean) => void
): string => {
  let response = "";
  let matchedProducts: ProductDetailProps[] = [];
  const lowercaseQuery = userQuery.toLowerCase();
  
  if (lowercaseQuery.includes("schmerz") || lowercaseQuery.includes("pain")) {
    response = "Für Schmerzpatienten empfehle ich folgende Produkte, die entzündungshemmend wirken oder bei stärkeren Schmerzen helfen können:";
    matchedProducts = [...products.filter(p => 
      p.effects?.some(e => e.toLowerCase().includes("schmerz")) ||
      p.benefits?.some(b => b.toLowerCase().includes("schmerz"))
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("schlaf") || lowercaseQuery.includes("sleep")) {
    response = "Bei Schlafstörungen können diese Produkte besonders hilfreich sein:";
    matchedProducts = [...products.filter(p => 
      p.effects?.some(e => e.toLowerCase().includes("schlaf")) ||
      p.benefits?.some(b => b.toLowerCase().includes("schlaf"))
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("angst") || lowercaseQuery.includes("anxiety")) {
    response = "Gegen Angstzustände wirken folgende Produkte besonders gut:";
    matchedProducts = [...products.filter(p => 
      p.effects?.some(e => e.toLowerCase().includes("angst")) ||
      p.benefits?.some(b => b.toLowerCase().includes("angst")) ||
      p.strain?.toLowerCase().includes("indica")
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("appetit") || lowercaseQuery.includes("hunger")) {
    response = "Diese Produkte können den Appetit anregen:";
    matchedProducts = [...products.filter(p => 
      p.strain?.toLowerCase().includes("indica") || 
      parseFloat(p.thc?.replace("%", "") || "0") > 15
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("thc")) {
    response = "Hier sind unsere THC-haltigen Produkte:";
    matchedProducts = [...products.filter(p => 
      parseFloat(p.thc?.replace("%", "") || "0") > 15
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("cbd")) {
    response = "Hier sind unsere CBD-haltigen Produkte:";
    matchedProducts = [...products.filter(p => 
      parseFloat(p.cbd?.replace("%", "") || "0") > 0.5
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("kreativ") || lowercaseQuery.includes("fokus") || lowercaseQuery.includes("concentration")) {
    response = "Für Kreativität und Fokus sind diese Sorten besonders geeignet:";
    matchedProducts = [...products.filter(p => 
      p.strain?.toLowerCase().includes("sativa") ||
      p.effects?.some(e => e.toLowerCase().includes("fokus") || e.toLowerCase().includes("kreativ"))
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("indica")) {
    response = "Hier sind unsere Indica-Sorten, die für tiefe Entspannung bekannt sind:";
    matchedProducts = [...products.filter(p => 
      p.strain?.toLowerCase().includes("indica")
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("sativa")) {
    response = "Hier sind unsere Sativa-Sorten, die für energetische Effekte bekannt sind:";
    matchedProducts = [...products.filter(p => 
      p.strain?.toLowerCase().includes("sativa")
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("hybrid")) {
    response = "Hier sind unsere ausgewogenen Hybrid-Sorten:";
    matchedProducts = [...products.filter(p => 
      p.strain?.toLowerCase().includes("hybrid")
    )].slice(0, 3);
  } else if (lowercaseQuery.includes("produkt") || lowercaseQuery.includes("empfehl") || lowercaseQuery.includes("zeig")) {
    response = "Hier sind einige unserer beliebtesten Produkte:";
    matchedProducts = [...products].slice(0, 3);
  } else {
    response = "Basierend auf deiner Anfrage könnte ich dir folgende Produkte empfehlen:";
    const randomProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 3);
    matchedProducts = randomProducts;
  }

  setRecommendedProducts(matchedProducts);
  setShowProducts(matchedProducts.length > 0);
  
  return response;
};

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
  toast: any
): Promise<{
  botResponse: string;
  products: ProductDetailProps[];
  actions: any;
} | null> => {
  if (!webhookUrl || !useN8nAgent) return null;
  
  try {
    setIsLoading(true);
    console.log("Sende Anfrage an n8n Webhook:", webhookUrl);
    
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
    
    if (!response.ok) {
      throw new Error(`Webhook responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("Antwort vom n8n Webhook:", data);
    
    return {
      botResponse: data.message || "Ich konnte keine Antwort vom n8n-Agenten erhalten.",
      products: data.products || [],
      actions: data.actions || {}
    };
  } catch (error) {
    console.error("Fehler bei der Kommunikation mit n8n:", error);
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
