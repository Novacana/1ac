
import { useState, useEffect } from 'react';
import { useProductLoader } from './useProductLoader';
import { Product } from '@/types/product';
import { ProductDetailProps } from '@/components/ProductDetail';

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
      // Create unique suggestions from relevant product attributes
      const suggestionsSet = new Set<string>();
      
      allProducts.forEach(product => {
        // Add product names
        if (product.name) suggestionsSet.add(product.name);
        
        // Add product strains if available
        if (product.strain) suggestionsSet.add(product.strain);
        
        // Add effects
        if (product.effects && Array.isArray(product.effects)) {
          product.effects.forEach(effect => {
            if (effect) suggestionsSet.add(effect);
          });
        }
        
        // Add benefits (symptoms) - safely access as it might not exist in the Product type
        // Use type assertion to handle the potential extended product properties
        const extendedProduct = product as (Product & Partial<ProductDetailProps>);
        if (extendedProduct.benefits && Array.isArray(extendedProduct.benefits)) {
          extendedProduct.benefits.forEach(benefit => {
            if (benefit) suggestionsSet.add(benefit);
          });
        }
        
        // Add flavors
        if (product.flavors && Array.isArray(product.flavors)) {
          product.flavors.forEach(flavor => {
            if (flavor) suggestionsSet.add(flavor);
          });
        }
      });
      
      // Convert to array and sort
      setSuggestions(Array.from(suggestionsSet).sort());
    }
  }, [allProducts]);

  return { suggestions, isLoading };
};
