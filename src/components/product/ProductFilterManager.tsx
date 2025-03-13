
import React, { useState, useEffect } from "react";
import { FilterOptions } from "@/components/home/Filters";
import { useLocation } from "react-router-dom";

// Constants for filter limits
export const MAX_THC = 30;
export const MAX_PRICE_LIMIT = 500;

interface ProductFilterManagerProps {
  children: (filterProps: {
    filters: FilterOptions;
    setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    filtersExpanded: boolean;
    toggleFiltersExpansion: () => void;
    handleResetFilters: () => void;
    maxPrice: number;
  }) => React.ReactNode;
  maxPrice: number;
}

const ProductFilterManager: React.FC<ProductFilterManagerProps> = ({ 
  children,
  maxPrice 
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);
  
  // Parse search query from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchFromUrl = queryParams.get("search") || "";
  
  // Initialize filters
  const [filters, setFilters] = useState<FilterOptions>({
    thcRange: [0, MAX_THC],
    priceRange: [0, maxPrice],
    sortBy: 'popularity'
  });

  // Update filter price range when maxPrice changes
  useEffect(() => {
    if (maxPrice !== filters.priceRange[1]) {
      setFilters(prev => ({
        ...prev,
        priceRange: [prev.priceRange[0], maxPrice]
      }));
    }
  }, [maxPrice]);
  
  // Set search query from URL if present
  useEffect(() => {
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      // Auto-expand filters if there's a search query in URL
      setFiltersExpanded(true);
    }
  }, [searchFromUrl]);

  // Toggle filters expansion
  const toggleFiltersExpansion = () => {
    setFiltersExpanded(!filtersExpanded);
  };
  
  // Reset filters to defaults
  const handleResetFilters = () => {
    setFilters({
      thcRange: [0, MAX_THC],
      priceRange: [0, maxPrice],
      sortBy: 'popularity'
    });
    setSearchQuery("");
  };

  return (
    <>
      {children({
        filters,
        setFilters, 
        searchQuery, 
        setSearchQuery,
        filtersExpanded,
        toggleFiltersExpansion,
        handleResetFilters,
        maxPrice
      })}
    </>
  );
};

export default ProductFilterManager;
