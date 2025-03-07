
import { ProductDetailProps } from "@/components/ProductDetail";
import { blütenProducts } from "./blüten";
import { oilsProducts } from "./oils";
import { hybridsProducts } from "./hybrids";
import { indicaProducts } from "./indica";

// Combine all products from different files
const allProducts = [
  ...blütenProducts,
  ...oilsProducts,
  ...hybridsProducts,
  ...indicaProducts,
];

// Export individual product arrays by category
export const getProductsByCategory = (category: string): ProductDetailProps[] => {
  return allProducts.filter(product => product.category === category);
};

// Export all products
export const getAllProducts = (): ProductDetailProps[] => {
  return allProducts;
};

// Export individual products by ID
export const getProductById = (id: string): ProductDetailProps | undefined => {
  return allProducts.find(product => product.id === id);
};

// Export all products
export { allProducts as products };

// Re-export individual product arrays
export { blütenProducts } from "./blüten";
export { oilsProducts } from "./oils";
export { hybridsProducts } from "./hybrids";
export { indicaProducts } from "./indica";
