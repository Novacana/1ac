
import { ProductDetailProps } from "@/components/ProductDetail";
import { blütenProducts } from "./blüten";
import { hybridsProducts } from "./hybrids";
import { indicaProducts } from "./indica";
import { oilsProducts } from "./oils";

// Combine all products from different categories
export const products: ProductDetailProps[] = [
  ...blütenProducts,
  ...hybridsProducts,
  ...indicaProducts,
  ...oilsProducts
];

// Define mapping between English and German category names
const categoryMapping: Record<string, string> = {
  "Flowers": "Blüten",
  "Oils": "Öle",
  "Edibles": "Esswaren",
  "Topicals": "Topische Mittel",
  "Vapes": "Vaporisatoren",
  "Accessories": "Zubehör"
};

// Helper function to get products by category
export const getProductsByCategory = (category: string): ProductDetailProps[] => {
  // Get the corresponding German category if an English one was provided
  const germanCategory = categoryMapping[category] || category;
  
  return products.filter(product => 
    product.category === category || 
    product.category === germanCategory
  );
};

// Helper function to get product by ID
export const getProductById = (id: string): ProductDetailProps | undefined => {
  return products.find(product => product.id === id);
};
