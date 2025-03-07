
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { products } from "@/data/products";
import EmptyProductState from "@/components/EmptyProductState";
import { toast } from "sonner";
import Filters, { FilterOptions } from "@/components/home/Filters";
import { Product } from "@/types/product";
import { isWooCommerceConfigured, fetchWooCommerceProducts } from "@/utils/woocommerce";
import ProductList from "@/components/product/ProductList";
import LoadingState from "@/components/product/LoadingState";
import DataSourceIndicator from "@/components/product/DataSourceIndicator";
import { parseThcPercentage, convertLocalProducts } from "@/utils/product-display-utils";

const Products = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState<{[key: string]: boolean}>({});
  const [dataSource, setDataSource] = useState<"woocommerce" | "local" | "combined" | "loading">("loading");
  
  // Get max price from all products for slider range
  const maxPrice = Math.ceil(Math.max(...products.map(p => typeof p.price === 'number' ? p.price : 0)));
  
  // Initialize filters
  const [filters, setFilters] = useState<FilterOptions>({
    thcRange: [0, 30],
    priceRange: [0, maxPrice],
    sortBy: 'popularity'
  });

  useEffect(() => {
    const loadProducts = async () => {
      // Array to hold products from all sources
      let combinedProducts: Product[] = [];
      let source: "woocommerce" | "local" | "combined" = "local";
      
      // First try to load from WooCommerce if configured
      if (isWooCommerceConfigured()) {
        try {
          const wooProducts = await fetchWooCommerceProducts();
          if (wooProducts && wooProducts.length > 0) {
            console.log(`Loaded ${wooProducts.length} products from WooCommerce`);
            combinedProducts = [...wooProducts];
            source = "woocommerce";
            toast.success(`Loaded ${wooProducts.length} products from WooCommerce`);
          }
        } catch (error) {
          console.error("Error loading WooCommerce products:", error);
          toast.error("Failed to load WooCommerce products, using local data instead");
        }
      }
      
      // Always add local products
      const convertedProducts = convertLocalProducts(products);
      
      // Add local products to the combined list
      if (combinedProducts.length > 0) {
        console.log(`Adding ${convertedProducts.length} local products to ${combinedProducts.length} WooCommerce products`);
        combinedProducts = [...combinedProducts, ...convertedProducts];
        source = "combined";
      } else {
        combinedProducts = convertedProducts;
        source = "local";
      }
      
      // Remove potential duplicates by ID
      const uniqueProducts = Array.from(
        new Map(combinedProducts.map(item => [item.id, item])).values()
      );
      
      console.log(`Final product count: ${uniqueProducts.length}`);
      setAllProducts(uniqueProducts);
      setFilteredProducts(uniqueProducts);
      setDataSource(source);
      
      // Pre-load images to check for errors
      uniqueProducts.forEach(product => {
        const img = new Image();
        img.onload = () => {
          setImagesLoaded(prev => ({...prev, [product.id]: true}));
        };
        img.src = product.image;
      });
    };
    
    loadProducts();
  }, []);

  // Apply filters
  useEffect(() => {
    let result = allProducts.filter(product => {
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
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'thc-desc':
        result.sort((a, b) => parseThcPercentage(b.thc) - parseThcPercentage(a.thc));
        break;
      case 'popularity':
        // We don't have real popularity data, so we'll just use the original order
        break;
    }
    
    setFilteredProducts(result);
  }, [allProducts, filters]);
  
  // Reset filters to defaults
  const handleResetFilters = () => {
    setFilters({
      thcRange: [0, 30],
      priceRange: [0, maxPrice],
      sortBy: 'popularity'
    });
  };

  if (dataSource === "loading") {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">Unsere Produkte</h1>
          <LoadingState />
        </div>
      </Layout>
    );
  }

  if (!filteredProducts || filteredProducts.length === 0) {
    return <EmptyProductState message="Keine Produkte gefunden" />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Unsere Produkte</h1>
          <DataSourceIndicator dataSource={dataSource} />
        </div>
        
        <Filters 
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          maxPrice={maxPrice}
        />
        
        <ProductList 
          products={filteredProducts} 
          imagesLoaded={imagesLoaded}
          setImagesLoaded={setImagesLoaded}
        />
      </div>
    </Layout>
  );
};

export default Products;
