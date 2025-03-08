
// Shopify product interface
export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  description: string;
  published_at?: string;
  created_at?: string;
  vendor: string;
  product_type: string;
  available: boolean;
  tags: string[];
  variants: {
    id: number;
    title: string;
    price: string;
    available: boolean;
    inventory_quantity: number;
  }[];
  images: {
    id: number;
    src: string;
    alt: string;
  }[];
  options: {
    id: number;
    name: string;
    values: string[];
  }[];
}

// Shopify API connection settings
export interface ShopifyConfig {
  shopUrl: string;
  accessToken: string;
  apiVersion: string;
}
