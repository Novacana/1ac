import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Product } from "@/types/product";
import CategoryFilter from "@/components/home/CategoryFilter";
import CarouselSection from "@/components/home/CarouselSection";
import FeaturesSection from "@/components/home/FeaturesSection";

// Sample data - in a real app this would come from an API
const categories = [
  "Flowers",
  "Oils",
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
  const [selectedCategory, setSelectedCategory] = useState("Flowers");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Apply category selection only (removed filters)
  useEffect(() => {
    import('@/data/products').then(({ getProductsByCategory }) => {
      const dataProducts = getProductsByCategory(selectedCategory);
      
      if (dataProducts && dataProducts.length > 0) {
        console.log("Using products from data directory:", dataProducts.length);
        
        // Process data directory products
        const processedDataProducts = dataProducts.map(product => {
          // Ensure images is an array and fix paths
          const fixedImages = (product.images || []).map(img => {
            if (img.startsWith("public/")) {
              return img.replace("public/", "/");
            }
            return img.startsWith("/") ? img : `/${img}`;
          });
          
          // Convert to Product type to ensure compatibility
          return {
            ...product,
            image: fixedImages[0] || "/placeholder.svg", // Add required image property
            images: fixedImages.length > 0 ? fixedImages : ["/placeholder.svg"]
          } as Product;
        });
        
        setFilteredProducts(processedDataProducts);
      }
    });
  }, [selectedCategory]);

  return (
    <Layout>
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
      
      <CarouselSection 
        products={filteredProducts}
        selectedCategory={selectedCategory}
      />
      
      <FeaturesSection />
    </Layout>
  );
};

export default Index;
