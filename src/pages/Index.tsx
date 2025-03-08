
import { useState } from "react";
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
  
  return (
    <Layout fullWidth>
      <CategoryFilter 
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
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
