
export interface FilterOptions {
  thcRange: [number, number];
  priceRange: [number, number];
  sortBy: string;
}

export interface FiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onReset: () => void;
  maxPrice: number;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  isExpanded?: boolean;
  onSearchFieldClick?: () => void;
}

// Constants for filter limits
export const MAX_THC = 30;
export const MAX_PRICE_LIMIT = 500; // Set a reasonable upper price limit
