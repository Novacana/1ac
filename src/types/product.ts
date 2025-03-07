
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  thc?: string;
  cbd?: string;
  category: string;
  modelUrl?: string; // For potential 3D model URLs in the future
}
