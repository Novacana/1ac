
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Product } from "@/types/product";
import ProductDataLoader from "@/components/home/ProductDataLoader";
import ProductFilterManager, { MAX_PRICE_LIMIT } from "@/components/product/ProductFilterManager";
import ProductsContent from "@/components/product/ProductsContent";
import { useProductFiltering } from "@/hooks/useProductFiltering";

const Products = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState<{[key: string]: boolean}>({});
  const [dataSource, setDataSource] = useState<"woocommerce" | "local" | "combined" | "loading">("loading");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Find max price for filter slider (with a reasonable upper limit)
  const maxPrice = allProducts.length > 0 
    ? Math.min(Math.ceil(Math.max(...allProducts.map(p => p.price || 0))), MAX_PRICE_LIMIT)
    : MAX_PRICE_LIMIT;

  // Handle products loaded from ProductDataLoader
  const handleProductsLoaded = (products: Product[], source: "woocommerce" | "combined" | "local") => {
    console.log(`Products loaded: ${products.length} from source: ${source}`);
    
    // Reset image loaded states for new products
    const newImagesLoaded: {[key: string]: boolean} = {};
    products.forEach(product => {
      newImagesLoaded[product.id] = false;
    });
    setImagesLoaded(newImagesLoaded);
    
    setAllProducts(products);
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

  return (
    <Layout fullWidth>
      <div className="w-full px-4">
        <ProductFilterManager maxPrice={maxPrice}>
          {({ 
            filters, 
            setFilters, 
            searchQuery, 
            setSearchQuery,
            filtersExpanded,
            toggleFiltersExpansion,
            handleResetFilters
          }) => {
            // Use the filtering hook to get filtered products
            const { filteredProducts } = useProductFiltering({
              allProducts,
              filters,
              selectedCategory,
              searchQuery
            });

            return (
              <>
                <ProductsContent 
                  isLoading={!initialLoadComplete}
                  filteredProducts={filteredProducts}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  filters={filters}
                  onFilterChange={setFilters}
                  onResetFilters={handleResetFilters}
                  maxPrice={maxPrice}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  filtersExpanded={filtersExpanded}
                  onSearchFieldClick={toggleFiltersExpansion}
                  imagesLoaded={imagesLoaded}
                  setImagesLoaded={setImagesLoaded}
                />
                
                <ProductDataLoader 
                  selectedCategory={selectedCategory}
                  onProductsLoaded={handleProductsLoaded}
                />
              </>
            );
          }}
        </ProductFilterManager>
      </div>
    </Layout>
  );
};

export default Products;
