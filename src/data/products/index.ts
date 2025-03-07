
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

// Helper function to get all products
export const getAllProducts = (): ProductDetailProps[] => {
  return products;
};

// Helper function to get products by category
export const getProductsByCategory = (category: string): ProductDetailProps[] => {
  return products.filter(product => 
    product.category === category || 
    // Handle English/German category mapping
    (product.category === "Blüten" && category === "Flowers") ||
    (product.category === "Öle" && category === "Oils") ||
    (product.category === "Zubehör" && category === "Accessories")
  );
};

// Helper function to get product by ID
export const getProductById = (id: string): ProductDetailProps | undefined => {
  return products.find(product => product.id === id);
};
