
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  description: string;
  thc?: string;
  cbd?: string;
  category: string;
  strain?: string;
  terpenes?: { name: string; percentage: string }[];
  effects?: string[];
  flavors?: string[];
  origin?: string;
  recommended_use?: string;
  lab_tested?: boolean;
  product_type?: string;
  weight?: string;
  potency?: string;
  source?: "woocommerce" | "shopify" | "local" | "pharmacy";  // Updated to include "pharmacy"
  stock?: number;  // Added stock property
  requiresPrescription?: boolean;  // Added requiresPrescription property
}
