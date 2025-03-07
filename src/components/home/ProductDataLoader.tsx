
import React from "react";
import { Product } from "@/types/product";
import { useProductLoader } from "@/hooks/useProductLoader";
import { DataSource } from "@/hooks/useProductSources";

interface ProductDataLoaderProps {
  selectedCategory: string;
  onProductsLoaded: (products: Product[], source: DataSource) => void;
}

/**
 * Component that handles loading product data from various sources
 * This is a presentational wrapper around the useProductLoader hook
 */
const ProductDataLoader: React.FC<ProductDataLoaderProps> = ({ 
  selectedCategory, 
  onProductsLoaded 
}) => {
  // Use the custom hook to load products
  const { error } = useProductLoader({
    selectedCategory,
    onProductsLoaded
  });

  // Log errors but don't display them (handled by parent components)
  if (error) {
    console.error("Product loading error:", error);
  }

  // This is a logic-only component, no UI rendering
  return null;
};

export default ProductDataLoader;
