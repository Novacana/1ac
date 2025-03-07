
import { useState } from "react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import CategoryPill from "@/components/CategoryPill";
import ProductCarousel from "@/components/ProductCarousel";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";

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

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("Flowers");

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <Layout>
      {/* Category Pills in a single line below header */}
      <section className="py-0 border-b border-border/20">
        <div className="container">
          <div className="overflow-x-auto scrollbar-none py-2">
            <div className="flex items-center gap-3 justify-center md:justify-start min-w-max px-2">
              {categories.map((category, index) => (
                <CategoryPill
                  key={category}
                  label={category}
                  active={selectedCategory === category}
                  onClick={() => setSelectedCategory(category)}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* 3D Product Carousel section */}
      <section className="py-4 relative">
        <div className="container px-4 mx-auto">
          {/* 3D Product Carousel */}
          <ProductCarousel products={products} selectedCategory={selectedCategory} />
        </div>
      </section>

      {/* Traditional Products Grid (as backup/alternative) */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-background to-background/80">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  thc={product.thc}
                  cbd={product.cbd}
                  category={product.category}
                />
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 animate-fade-in">
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground">
                We couldn't find any products in this category.
              </p>
            </div>
          )}
        </div>
      </section>
      
      <section className="py-16 bg-primary/5">
        <div className="container px-4 mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 animate-slide-up">
            Why Choose 1A Cannabis for Medical Cannabis?
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Licensed Physicians",
                description: "Our products are prescribed by licensed doctors after a thorough consultation.",
              },
              {
                title: "Quality Guaranteed",
                description: "All products are lab-tested for purity, potency and safety.",
              },
              {
                title: "Discreet Delivery",
                description: "Your privacy matters - all orders are shipped in discreet packaging.",
              },
            ].map((item, index) => (
              <div 
                key={index}
                className={cn(
                  "p-6 rounded-xl border border-border/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                  "flex flex-col items-center text-center animate-scale-in"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-xl font-medium mb-3">{item.title}</h3>
                <p className="text-foreground/70">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
