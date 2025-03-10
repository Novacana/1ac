
import { NavigateFunction } from "react-router-dom";
import { products } from "@/data/products";
import { ToastFunction } from "../types";

export const createWebTools = (
  navigate: NavigateFunction,
  toast: ToastFunction
) => {
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
