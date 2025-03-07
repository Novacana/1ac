
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

const Products = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState<{[key: string]: boolean}>({});
  const [dataSource, setDataSource] = useState<"woocommerce" | "local" | "combined" | "loading">("loading");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Find max price for filter slider
  const maxPrice = allProducts.length > 0 
    ? Math.ceil(Math.max(...allProducts.map(p => p.price || 0))) 
    : 100;
  
  // Initialize filters
  const [filters, setFilters] = useState<FilterOptions>({
    thcRange: [0, 30],
    priceRange: [0, maxPrice || 100],
    sortBy: 'popularity'
  });

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
    
    // Update price range based on new products
    if (products.length > 0) {
      const newMaxPrice = Math.ceil(Math.max(...products.map(p => p.price || 0)));
      setFilters(prev => ({
        ...prev,
        priceRange: [prev.priceRange[0], newMaxPrice]
      }));
    }
  };

  // Handle category change
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // Apply filters
  useEffect(() => {
    if (allProducts.length === 0) return;
    
    let result = allProducts.filter(product => {
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
  }, [allProducts, filters, selectedCategory]);
  
  // Reset filters to defaults
  const handleResetFilters = () => {
    setFilters({
      thcRange: [0, 30],
      priceRange: [0, maxPrice],
      sortBy: 'popularity'
    });
    setSelectedCategory("All");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-2">
        {!initialLoadComplete ? (
          <LoadingState />
        ) : (
          <>
            <Filters 
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
              maxPrice={maxPrice}
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
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
