
import { useState } from "react";
import Layout from "@/components/Layout";
import { Product } from "@/types/product";
import CategoryFilter from "@/components/home/CategoryFilter";
import CarouselSection from "@/components/home/CarouselSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import ProductDataLoader from "@/components/home/ProductDataLoader";

// Sample data - in a real app this would come from an API
const categories = [
  "Blüten",
  "Öle",
  "Esswaren", 
  "Topische Mittel",
  "Vaporisatoren",
  "Zubehör",
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("Blüten");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  return (
    <Layout>
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
