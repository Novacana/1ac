
import { ProductDetailProps } from "@/components/ProductDetail";

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export type WebTools = {
  navigateToPage: (page: string) => string;
  searchProducts: (query: string) => string;
  showProductDetails: (productId: string | number) => string;
  addToCart: (productId: string | number, quantity?: number) => string;
};

export type ToolIntent = {
  tool: keyof WebTools;
  params: any;
};

export type N8nResponse = {
  botResponse: string;
  products: ProductDetailProps[];
  actions: any;
};
