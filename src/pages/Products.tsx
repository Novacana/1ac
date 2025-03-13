
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import EmptyProductState from "@/components/EmptyProductState";
import { toast } from "sonner";
import Filters, { FilterOptions } from "@/components/home/Filters";
import { Product } from "@/types/product";
import ProductList from "@/components/product/ProductList";
import LoadingState from "@/components/product/LoadingState";
import { parseThcPercentage } from "@/utils/product-value-utils";
import ProductDataLoader from "@/components/home/ProductDataLoader";
import { useLocation } from "react-router-dom";
import CategoryButtons from "@/components/product/CategoryButtons";

// Constants for filter limits
const MAX_THC = 30;
const MAX_PRICE_LIMIT = 500;

const Products = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState<{[key: string]: boolean}>({});
  const [dataSource, setDataSource] = useState<"woocommerce" | "local" | "combined" | "loading">("loading");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filtersExpanded, setFiltersExpanded] = useState<boolean>(false);
  
  // Parse search query from URL
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchFromUrl = queryParams.get("search") || "";
  
  useEffect(() => {
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      // Auto-expand filters if there's a search query in URL
      setFiltersExpanded(true);
    }
  }, [searchFromUrl]);
  
  // Find max price for filter slider (with a reasonable upper limit)
  const maxPrice = allProducts.length > 0 
    ? Math.min(Math.ceil(Math.max(...allProducts.map(p => p.price || 0))), MAX_PRICE_LIMIT)
    : MAX_PRICE_LIMIT;
  
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

  // Handle products loaded from ProductDataLoader
  const handleProductsLoaded = (products: Product[], source: "woocommerce" | "combined" | "local") => {
    console.log(`Products loaded: ${products.length} from source: ${source}`);
    
    // Reset image loaded states for new products
    const newImagesLoaded: {[key: string]: boolean} = {};
    products.forEach(product => {
      newImagesLoaded[product.id] = false;
    });
    setImagesLoaded(newImagesLoaded);
    
    if (products.length === 0 && source === "local") {
      // If no products were loaded, show a toast notification
      toast.info("Keine Produkte gefunden. Bitte versuchen Sie es später erneut.");
    }
    
    setAllProducts(products);
    setFilteredProducts(products);
    setDataSource(source);
    setInitialLoadComplete(true);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(products.map(p => p.category))].filter(Boolean) as string[];
    setCategories(uniqueCategories);
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Toggle filters expansion when search field is clicked
  const toggleFiltersExpansion = () => {
    setFiltersExpanded(!filtersExpanded);
  };

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
  
  // Reset filters to defaults
  const handleResetFilters = () => {
    setFilters({
      thcRange: [0, MAX_THC],
      priceRange: [0, maxPrice],
      sortBy: 'popularity'
    });
    setSelectedCategory("All");
    setSearchQuery("");
  };

  return (
    <Layout fullWidth>
      <div className="w-full px-4">
        {!initialLoadComplete ? (
          <LoadingState />
        ) : (
          <>
            {/* Add the CategoryButtons component before the Filters */}
            <CategoryButtons
              categories={["All", ...categories]}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
            />
            
            <Filters 
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
              maxPrice={maxPrice}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              isExpanded={filtersExpanded}
              onSearchFieldClick={toggleFiltersExpansion}
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
        )}
        
        {/* Hidden component to load products */}
        <ProductDataLoader 
          selectedCategory={selectedCategory}
          onProductsLoaded={handleProductsLoaded}
        />
      </div>
    </Layout>
  );
};

export default Products;
