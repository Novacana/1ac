
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
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
}
