
import { useState, useEffect } from 'react';
import { useProductLoader } from './useProductLoader';
import { Product } from '@/types/product';

export const useProductSuggestions = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Function to handle products loaded from the product loader
  const handleProductsLoaded = (products: Product[], source: any) => {
    setAllProducts(products);
  };
  
  // Use the product loader to get all products
  const { isLoading } = useProductLoader({
    selectedCategory: "All",
    onProductsLoaded: handleProductsLoaded
  });

  // Generate suggestions from products
  useEffect(() => {
    if (allProducts.length > 0) {
      // Create unique suggestions from product names, strains, and categories
      const nameSet = new Set<string>();
      
      // Add product names
      allProducts.forEach(product => {
        if (product.name) nameSet.add(product.name);
        
        // Add product strains if available
        if (product.strain) nameSet.add(product.strain);
        
        // Add certain keywords from descriptions
        if (product.description) {
          const words = product.description.split(/\s+/);
          words
            .filter(word => word.length > 5) // Only add meaningful words
            .forEach(word => {
              // Normalize word and check if it's meaningful
              const normalizedWord = word.replace(/[^\w\säöüß]/gi, '').trim();
              if (normalizedWord.length > 5) {
                nameSet.add(normalizedWord);
              }
            });
        }
      });
      
      // Convert to array and sort
      setSuggestions(Array.from(nameSet).sort());
    }
  }, [allProducts]);

  return { suggestions, isLoading };
};
