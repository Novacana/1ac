
import React from "react";
import { Product } from "@/types/product";
import ProductList from "@/components/product/ProductList";
import EmptyProductState from "@/components/EmptyProductState";
import CategoryButtons from "@/components/product/CategoryButtons";
import Filters from "@/components/home/Filters";
import LoadingState from "@/components/product/LoadingState";

interface ProductsContentProps {
  isLoading: boolean;
  filteredProducts: Product[];
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  filters: any;
  onFilterChange: (filters: any) => void;
  onResetFilters: () => void;
  maxPrice: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filtersExpanded: boolean;
  onSearchFieldClick: () => void;
  imagesLoaded: {[key: string]: boolean};
  setImagesLoaded: React.Dispatch<React.SetStateAction<{[key: string]: boolean}>>;
}

const ProductsContent: React.FC<ProductsContentProps> = ({
  isLoading,
  filteredProducts,
  categories,
  selectedCategory,
  onCategoryChange,
  filters,
  onFilterChange,
  onResetFilters,
  maxPrice,
  searchQuery,
  onSearchChange,
  filtersExpanded,
  onSearchFieldClick,
  imagesLoaded,
  setImagesLoaded
}) => {
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <>
      <CategoryButtons
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />
      
      <Filters 
        filters={filters}
        onFilterChange={onFilterChange}
        onReset={onResetFilters}
        maxPrice={maxPrice}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        isExpanded={filtersExpanded}
        onSearchFieldClick={onSearchFieldClick}
      />
      
      {filteredProducts.length === 0 ? (
        <EmptyProductState message="Keine Produkte gefunden" />
      ) : (
        <ProductList 
          products={filteredProducts} 
          imagesLoaded={imagesLoaded}
          setImagesLoaded={setImagesLoaded}
        />
      )}
    </>
  );
};

export default ProductsContent;
