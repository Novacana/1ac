
import { ToolIntent } from "../types";

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
