import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Product } from "@/types/product";
import CategoryFilter from "@/components/home/CategoryFilter";
import CarouselSection from "@/components/home/CarouselSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import Filters, { FilterOptions } from "@/components/home/Filters";

// Sample data - in a real app this would come from an API
const categories = [
  "Flowers",
  "Oils",
  "Edibles", 
  "Topicals",
  "Vapes",
  "Accessories",
];

const products: Product[] = [
  {
    id: "1",
    name: "Premium Indica Flower",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1603909223429-69bb7101f92e?q=80&w=2940&auto=format&fit=crop",
    description: "This premium indica strain delivers a powerful body high that melts away tension and induces deep relaxation. Grown organically in controlled environments to ensure maximum potency and consistency.",
    thc: "22%",
    cbd: "0.5%",
    category: "Flowers",
    strain: "Indica",
    terpenes: [
      { name: "Myrcene", percentage: "1.2%" },
      { name: "Limonene", percentage: "0.8%" },
      { name: "Caryophyllene", percentage: "0.6%" }
    ],
    effects: ["Relaxation", "Pain Relief", "Sleep Aid", "Stress Relief"],
    flavors: ["Earthy", "Pine", "Sweet"],
    origin: "Indoor Cultivation, Netherlands",
    recommended_use: "Evening use for relaxation and sleep aid",
    lab_tested: true,
    product_type: "Flower",
    weight: "3.5g",
    potency: "High"
  },
  {
    id: "2",
    name: "Full Spectrum CBD Oil",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1556928045-16f7f50be0f3?q=80&w=2787&auto=format&fit=crop",
    description: "Our full-spectrum CBD oil contains all beneficial cannabinoids and terpenes found in hemp plants. Cold-pressed extraction preserves the plant's natural properties, ensuring maximum efficacy.",
    thc: "<0.2%",
    cbd: "15%",
    category: "Oils",
    strain: "Hemp",
    terpenes: [
      { name: "Pinene", percentage: "0.9%" },
      { name: "Linalool", percentage: "0.7%" }
    ],
    effects: ["Calm", "Clarity", "Balance", "Recovery"],
    flavors: ["Herbal", "Nutty", "Natural"],
    origin: "Organic Hemp Farms, Colorado",
    recommended_use: "Place 1ml under the tongue, hold for 60 seconds before swallowing",
    lab_tested: true,
    product_type: "Tincture",
    weight: "30ml",
    potency: "Medium"
  },
  {
    id: "3",
    name: "Premium THC Vape Cartridge",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1625657799852-21d67cc39319?q=80&w=2787&auto=format&fit=crop",
    description: "Our distillate vape cartridges deliver pure THC with zero additives or cutting agents. Each cartridge is filled with strain-specific terpenes for an authentic cannabis experience.",
    thc: "85%",
    cbd: "0%",
    category: "Vapes",
    strain: "Hybrid",
    terpenes: [
      { name: "Terpinolene", percentage: "3.2%" },
      { name: "Ocimene", percentage: "2.1%" }
    ],
    effects: ["Euphoria", "Creativity", "Focus", "Energy"],
    flavors: ["Citrus", "Tropical", "Sweet"],
    origin: "California",
    recommended_use: "Small inhalations, start with 2-3 second draw",
    lab_tested: true,
    product_type: "510 Thread Cartridge",
    weight: "1g",
    potency: "Very High"
  },
  {
    id: "4",
    name: "CBD Relief Cream",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1607621048318-c2d5bdc0ee39?q=80&w=2940&auto=format&fit=crop",
    description: "This premium relief cream combines 500mg of CBD with arnica, menthol, and essential oils for targeted pain relief. The fast-absorbing formula provides cooling sensation and reduces inflammation.",
    thc: "0%",
    cbd: "5%",
    category: "Topicals",
    strain: "Hemp-derived",
    terpenes: [
      { name: "Bisabolol", percentage: "0.5%" },
      { name: "Humulene", percentage: "0.4%" }
    ],
    effects: ["Pain Relief", "Anti-inflammatory", "Cooling", "Moisturizing"],
    flavors: ["Menthol", "Eucalyptus", "Clean"],
    origin: "USA",
    recommended_use: "Apply to affected areas up to 4 times daily",
    lab_tested: true,
    product_type: "Topical Cream",
    weight: "100ml",
    potency: "Medium"
  },
  {
    id: "5",
    name: "THC-Infused Fruit Gummies",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1625517236224-4ab37a6425cb?q=80&w=2848&auto=format&fit=crop",
    description: "Our delicious fruit-flavored gummies contain precisely dosed THC for a consistent experience. Made with real fruit extracts and organic ingredients for superior taste and effect.",
    thc: "5mg per piece",
    cbd: "0mg",
    category: "Edibles",
    strain: "Sativa",
    terpenes: [
      { name: "Limonene", percentage: "1.0%" }
    ],
    effects: ["Euphoria", "Mood Elevation", "Creativity", "Social"],
    flavors: ["Strawberry", "Watermelon", "Blueberry", "Mango"],
    origin: "Made in Canada",
    recommended_use: "Start with 1 piece and wait 45-60 minutes before consuming more",
    lab_tested: true,
    product_type: "Edible",
    weight: "100mg total (20 pieces × 5mg)",
    potency: "Medium"
  },
  {
    id: "6",
    name: "Premium Herb Grinder",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1603851887849-5eca2b0f8fae?q=80&w=2940&auto=format&fit=crop",
    description: "This 4-piece CNC-machined aluminum grinder features diamond-shaped teeth for efficient grinding, a pollen screen, and a kief catcher to preserve valuable trichomes.",
    category: "Accessories",
    product_type: "Grinder",
    weight: "85g",
    origin: "Germany",
    recommended_use: "Ideal for preparing flower for smoking or vaporizing",
    lab_tested: false,
    effects: [],
    flavors: []
  },
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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  
  // Get max price from all products for slider range
  const maxPrice = Math.ceil(Math.max(...products.map(p => p.price)));
  
  // Initialize filters
  const [filters, setFilters] = useState<FilterOptions>({
    thcRange: [0, 30],
    priceRange: [0, maxPrice],
    sortBy: 'popularity'
  });

  // Apply filters and category selection
  useEffect(() => {
    let result = products.filter(product => {
      // Filter by category
      if (product.category !== selectedCategory && 
          !(product.category === "Blüten" && selectedCategory === "Flowers") &&
          !(product.category === "Öle" && selectedCategory === "Oils") &&
          !(product.category === "Zubehör" && selectedCategory === "Accessories")) {
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
  }, [selectedCategory, filters]);
  
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
      
      <CarouselSection 
        products={filteredProducts}
        selectedCategory={selectedCategory}
      />
      
      <FeaturesSection />
    </Layout>
  );
};

export default Index;
