
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { parseThcPercentage } from "@/utils/product-value-utils";
import { FilterOptions } from "@/components/home/Filters";

interface UseProductFilteringProps {
  allProducts: Product[];
  filters: FilterOptions;
  selectedCategory: string;
  searchQuery: string;
}

export const useProductFiltering = ({
  allProducts,
  filters,
  selectedCategory,
  searchQuery
}: UseProductFilteringProps) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Apply filters
  useEffect(() => {
    if (allProducts.length === 0) return;
    
    let result = allProducts.filter(product => {
      // Filter by search query
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.strain?.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !product.description.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by category
      if (selectedCategory !== "All" && product.category !== selectedCategory) {
        return false;
      }
      
      // Filter by price
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      
      // Filter by THC (skip for accessories which don't have THC)
      if (product.category !== "Accessories" && product.category !== "Zubehör") {
        const thcValue = parseThcPercentage(product.thc);
        if (thcValue < filters.thcRange[0] || thcValue > filters.thcRange[1]) {
          return false;
        }
      }
      
      return true;
    });
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'thc-desc':
        result.sort((a, b) => parseThcPercentage(b.thc) - parseThcPercentage(a.thc));
        break;
      case 'popularity':
        // We don't have real popularity data, so we'll just use the original order
        break;
    }
    
    setFilteredProducts(result);
  }, [allProducts, filters, selectedCategory, searchQuery]);

  return { filteredProducts };
};
