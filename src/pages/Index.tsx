
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Product } from "@/types/product";
import CategoryFilter from "@/components/home/CategoryFilter";
import CarouselSection from "@/components/home/CarouselSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import Filters, { FilterOptions } from "@/components/home/Filters";
import { getAllProducts } from "@/data/products";

// Sample categories
const categories = [
  "Blüten",
  "Öle",
  "Edibles", 
  "Topicals",
  "Vapes",
  "Accessories",
];

// Helper function to parse THC percentage to number
const parseThcPercentage = (thcStr?: string): number => {
  if (!thcStr) return 0;
  
  // Handle ranges like "10-15%"
  if (thcStr.includes("-")) {
    const parts = thcStr.split("-");
    const avg = parts.map(p => parseFloat(p)).reduce((a, b) => a + b, 0) / parts.length;
    return avg;
  }
  
  // Handle "< 0.2%" format
  if (thcStr.includes("<")) {
    return 0.1; // Just a small value for "less than" cases
  }
  
  // Handle "X% per piece" format
  if (thcStr.includes("per piece")) {
    return parseFloat(thcStr) || 0;
  }
  
  // Regular percentage
  return parseFloat(thcStr) || 0;
};

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("Blüten");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch products from our data
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        // Get products from our data directory
        const allProducts = getAllProducts();
        
        if (allProducts && allProducts.length > 0) {
          console.log("Loaded products from data:", allProducts.length);
          setProducts(allProducts);
        } else {
          console.warn("No products found in data directory");
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Get max price from all products for slider range
  const maxPrice = Math.ceil(Math.max(...(products.length > 0 ? products.map(p => p.price) : [100])));
  
  // Initialize filters
  const [filters, setFilters] = useState<FilterOptions>({
    thcRange: [0, 30],
    priceRange: [0, maxPrice],
    sortBy: 'popularity'
  });

  // Update filters when maxPrice changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      priceRange: [prev.priceRange[0], maxPrice]
    }));
  }, [maxPrice]);

  // Apply filters and category selection
  useEffect(() => {
    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }
    
    let result = products.filter(product => {
      // Filter by category
      if (product.category !== selectedCategory) {
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
  }, [selectedCategory, filters, products]);
  
  // Reset filters to defaults
  const handleResetFilters = () => {
    setFilters({
      thcRange: [0, 30],
      priceRange: [0, maxPrice],
      sortBy: 'popularity'
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Willkommen in unserem Cannabis Shop</h1>
        
        <CategoryFilter 
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        
        <Filters 
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
          maxPrice={maxPrice}
        />
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          </div>
        ) : (
          <>
            <CarouselSection 
              products={filteredProducts}
              selectedCategory={selectedCategory}
            />
            
            <FeaturesSection />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Index;
