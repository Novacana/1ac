
import { ProductDetailProps } from "@/components/ProductDetail";

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface WebTools {
  navigateToPage: (page: string) => string;
  searchProducts: (query: string) => string;
  showProductDetails: (productId: string | number) => string;
  addToCart: (productId: string | number, quantity?: number) => string;
}

export interface ToolIntent {
  tool: keyof WebTools;
  params: any;
}
