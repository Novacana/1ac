
import { useState, useEffect, useRef } from "react";
import { Product } from "@/types/product";
import { filterProductsByCategory } from "@/utils/product-filter-utils";
import { removeDuplicateProducts } from "@/utils/product-filter-utils";
import { DataSource, loadProductsFromAllSources } from "./useProductSources";

interface UseProductLoaderProps {
  selectedCategory: string;
  onProductsLoaded: (products: Product[], source: DataSource) => void;
}

interface UseProductLoaderResult {
  isLoading: boolean;
  error: string | null;
}

/**
 * Custom hook to load products from various sources
 */
export const useProductLoader = ({
  selectedCategory,
  onProductsLoaded
}: UseProductLoaderProps): UseProductLoaderResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadedRef = useRef(false);
  const previousCategoryRef = useRef(selectedCategory);
  const effectRunningRef = useRef(false);

  useEffect(() => {
    // Prevent multiple simultaneous executions
    if (effectRunningRef.current) {
      console.log("Effect already running, skipping...");
      return;
    }
    
    // Force reload when category changes
    const shouldReload = previousCategoryRef.current !== selectedCategory;
    
    const loadProducts = async () => {
      // Set loading flag and mark effect as running
      setIsLoading(true);
      setError(null);
      effectRunningRef.current = true;
      
      try {
        console.log(`Loading products for category: ${selectedCategory}`);
        const { allProducts, dataSource } = await loadProductsFromAllSources(
          selectedCategory, 
          loadedRef.current
        );
        
        console.log(`Combined ${allProducts.length} products for category ${selectedCategory}`);
        
        // Filter products by selected category if not "All"
        let filteredProducts = selectedCategory.toLowerCase() === "all" 
          ? allProducts 
          : filterProductsByCategory(allProducts, selectedCategory);
        
        // Remove potential duplicates (by ID)
        const uniqueProducts = removeDuplicateProducts(filteredProducts);
        
        console.log(`Final unique product count: ${uniqueProducts.length} (Data source: ${dataSource})`);
        
        // Mark as loaded and store current category
        loadedRef.current = true;
        previousCategoryRef.current = selectedCategory;
        
        // Pass the filtered products and data source to parent component
        onProductsLoaded(uniqueProducts, dataSource);
      } catch (err) {
        console.error("Error loading products:", err);
        setError(err instanceof Error ? err.message : "Failed to load products");
        
        // Fallback to empty products array on error
        onProductsLoaded([], "local");
      } finally {
        // Clean up, regardless of success or failure
        setIsLoading(false);
        effectRunningRef.current = false;
      }
    };
    
    loadProducts();
    
    // No cleanup function needed
  }, [selectedCategory, onProductsLoaded]);

  return { isLoading, error };
};
