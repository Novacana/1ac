
import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { Product } from "@/types/product";
import CategoryFilter from "@/components/home/CategoryFilter";
import CarouselSection from "@/components/home/CarouselSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ProductDataLoader from "@/components/home/ProductDataLoader";

// Updated category names to match those in CategoryPill component
const categories = [
  "Flowers",
  "Oils",
  "Edibles", 
  "Topicals",
  "Vapes",
  "Accessories",
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("Flowers");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const productLoaderRendered = useRef(false);
  
  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    productLoaderRendered.current = false;
  };
  
  return (
    <Layout>
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />
      
      <ProductDataLoader
        selectedCategory={selectedCategory}
        onProductsLoaded={setFilteredProducts}
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
