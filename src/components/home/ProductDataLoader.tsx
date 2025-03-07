
import { useState, useEffect } from "react";
import { Product } from "@/types/product";

interface ProductDataLoaderProps {
  selectedCategory: string;
  onProductsLoaded: (products: Product[]) => void;
}

const ProductDataLoader: React.FC<ProductDataLoaderProps> = ({ 
  selectedCategory, 
  onProductsLoaded 
}) => {
  useEffect(() => {
    import('@/data/products').then(({ getProductsByCategory }) => {
      const dataProducts = getProductsByCategory(selectedCategory);
      
      if (dataProducts && dataProducts.length > 0) {
        console.log("Using products from data directory:", dataProducts.length);
        
        // Process data directory products
        const processedDataProducts = dataProducts.map(product => {
          // Ensure images is an array and fix paths
          const fixedImages = (product.images || []).map(img => {
            if (img.startsWith("public/")) {
              return img.replace("public/", "/");
            }
            return img.startsWith("/") ? img : `/${img}`;
          });
          
          // Convert to Product type to ensure compatibility
          return {
            ...product,
            image: fixedImages[0] || "/placeholder.svg", // Add required image property
            images: fixedImages.length > 0 ? fixedImages : ["/placeholder.svg"]
          } as Product;
        });
        
        onProductsLoaded(processedDataProducts);
      }
    });
  }, [selectedCategory, onProductsLoaded]);

  return null; // This is a logic-only component, no UI rendering
};

export default ProductDataLoader;
