
import { ProductDetailProps } from "@/components/ProductDetail";
import { products } from "@/data/products";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ToolIntent, WebTools } from "./types";

export const createWebTools = (navigate: ReturnType<typeof useNavigate>, toast: ReturnType<typeof useToast>["toast"]) => {
  const webTools: WebTools = {
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
      
      // Close advisor before navigation
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
      const id = typeof productId === 'string' ? parseInt(productId) : productId;
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
      const id = typeof productId === 'string' ? parseInt(productId) : productId;
      const product = products.find(p => p.id === id);
      
      if (product) {
        // Normally we would call a cart context function here
        toast({
          title: "Produkt zum Warenkorb hinzugefügt",
          description: `${quantity}x ${product.name} wurde zum Warenkorb hinzugefügt.`,
        });
        
        return `Ich habe ${quantity}x ${product.name} zum Warenkorb hinzugefügt.`;
      }
      
      return "Ich konnte dieses Produkt nicht finden.";
    }
  };

  return webTools;
};

// Parse user message and detect tool usage intent
export const detectToolIntent = (message: string): ToolIntent | null => {
  const lowerMessage = message.toLowerCase();
  
  // Navigation intent
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
      // Extract product ID if available
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
  
  // Search intent
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
      // Extract potential keywords
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
  
  // Add to cart intent
  if (
    lowerMessage.includes('zum warenkorb hinzufügen') || 
    lowerMessage.includes('in den warenkorb') || 
    lowerMessage.includes('kaufen') ||
    lowerMessage.includes('bestellen')
  ) {
    // Extract product ID and quantity if available
    const productIdMatch = lowerMessage.match(/produkt\s+(\d+)/i);
    const quantityMatch = lowerMessage.match(/(\d+)\s*stück/i);
    
    if (productIdMatch && productIdMatch[1]) {
      const productId = productIdMatch[1];
      const quantity = quantityMatch && quantityMatch[1] ? parseInt(quantityMatch[1]) : 1;
      return { tool: 'addToCart', params: { productId, quantity } };
    }
  }
  
  // Show product details intent
  if (
    lowerMessage.includes('details zu produkt') || 
    lowerMessage.includes('mehr über produkt') || 
    lowerMessage.includes('information zu produkt')
  ) {
    // Extract product ID if available
    const productIdMatch = lowerMessage.match(/produkt\s+(\d+)/i);
    if (productIdMatch && productIdMatch[1]) {
      return { tool: 'showProductDetails', params: productIdMatch[1] };
    }
  }
  
  return null;
};

export const processQuery = (
  query: string,
  setRecommendedProducts: (products: ProductDetailProps[]) => void,
  setShowProducts: (show: boolean) => void
): string => {
  let response = "";
  let matchedProducts: ProductDetailProps[] = [];
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes("schmerz") || lowerQuery.includes("pain")) {
    response = "Für Schmerzpatienten empfehle ich folgende Produkte, die entzündungshemmend wirken oder bei stärkeren Schmerzen helfen können:";
    matchedProducts = [...products.filter(p => 
      p.effects?.some(e => e.toLowerCase().includes("schmerz")) ||
      p.benefits?.some(b => b.toLowerCase().includes("schmerz"))
    )].slice(0, 3);
  } else if (lowerQuery.includes("schlaf") || lowerQuery.includes("sleep")) {
    response = "Bei Schlafstörungen können diese Produkte besonders hilfreich sein:";
    matchedProducts = [...products.filter(p => 
      p.effects?.some(e => e.toLowerCase().includes("schlaf")) ||
      p.benefits?.some(b => b.toLowerCase().includes("schlaf"))
    )].slice(0, 3);
  } else if (lowerQuery.includes("angst") || lowerQuery.includes("anxiety")) {
    response = "Gegen Angstzustände wirken folgende Produkte besonders gut:";
    matchedProducts = [...products.filter(p => 
      p.effects?.some(e => e.toLowerCase().includes("angst")) ||
      p.benefits?.some(b => b.toLowerCase().includes("angst")) ||
      p.strain?.toLowerCase().includes("indica")
    )].slice(0, 3);
  } else if (lowerQuery.includes("appetit") || lowerQuery.includes("hunger")) {
    response = "Diese Produkte können den Appetit anregen:";
    matchedProducts = [...products.filter(p => 
      p.strain?.toLowerCase().includes("indica") || 
      parseFloat(p.thc?.replace("%", "") || "0") > 15
    )].slice(0, 3);
  } else if (lowerQuery.includes("thc")) {
    response = "Hier sind unsere THC-haltigen Produkte:";
    matchedProducts = [...products.filter(p => 
      parseFloat(p.thc?.replace("%", "") || "0") > 15
    )].slice(0, 3);
  } else if (lowerQuery.includes("cbd")) {
    response = "Hier sind unsere CBD-haltigen Produkte:";
    matchedProducts = [...products.filter(p => 
      parseFloat(p.cbd?.replace("%", "") || "0") > 0.5
    )].slice(0, 3);
  } else if (lowerQuery.includes("kreativ") || lowerQuery.includes("fokus") || lowerQuery.includes("concentration")) {
    response = "Für Kreativität und Fokus sind diese Sorten besonders geeignet:";
    matchedProducts = [...products.filter(p => 
      p.strain?.toLowerCase().includes("sativa") ||
      p.effects?.some(e => e.toLowerCase().includes("fokus") || e.toLowerCase().includes("kreativ"))
    )].slice(0, 3);
  } else if (lowerQuery.includes("indica")) {
    response = "Hier sind unsere Indica-Sorten, die für tiefe Entspannung bekannt sind:";
    matchedProducts = [...products.filter(p => 
      p.strain?.toLowerCase().includes("indica")
    )].slice(0, 3);
  } else if (lowerQuery.includes("sativa")) {
    response = "Hier sind unsere Sativa-Sorten, die für energetische Effekte bekannt sind:";
    matchedProducts = [...products.filter(p => 
      p.strain?.toLowerCase().includes("sativa")
    )].slice(0, 3);
  } else if (lowerQuery.includes("hybrid")) {
    response = "Hier sind unsere ausgewogenen Hybrid-Sorten:";
    matchedProducts = [...products.filter(p => 
      p.strain?.toLowerCase().includes("hybrid")
    )].slice(0, 3);
  } else if (lowerQuery.includes("produkt") || lowerQuery.includes("empfehl") || lowerQuery.includes("zeig")) {
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
