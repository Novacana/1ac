
import { useState } from "react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import CategoryPill from "@/components/CategoryPill";
import { cn } from "@/lib/utils";

// Sample data - in a real app this would come from an API
const categories = [
  "All",
  "Flowers",
  "Oils",
  "Edibles",
  "Topicals",
  "Vapes",
  "Accessories",
];

const products = [
  {
    id: "1",
    name: "Medical Cannabis Flower",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1603909223429-69bb7101f92e?q=80&w=2940&auto=format&fit=crop",
    thc: "20%",
    cbd: "0.5%",
    category: "Flowers",
  },
  {
    id: "2",
    name: "CBD Oil Tincture",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1556928045-16f7f50be0f3?q=80&w=2787&auto=format&fit=crop",
    thc: "<0.2%",
    cbd: "10%",
    category: "Oils",
  },
  {
    id: "3",
    name: "THC Vape Cartridge",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1625657799852-21d67cc39319?q=80&w=2787&auto=format&fit=crop",
    thc: "80%",
    cbd: "0%",
    category: "Vapes",
  },
  {
    id: "4",
    name: "Hemp-Infused Body Cream",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1607621048318-c2d5bdc0ee39?q=80&w=2940&auto=format&fit=crop",
    thc: "0%",
    cbd: "5%",
    category: "Topicals",
  },
  {
    id: "5",
    name: "Cannabis-Infused Gummies",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1625517236224-4ab37a6425cb?q=80&w=2848&auto=format&fit=crop",
    thc: "5mg per piece",
    cbd: "0mg",
    category: "Edibles",
  },
  {
    id: "6",
    name: "Premium Grinder",
    price: 19.99,
    image: "https://images.unsplash.com/photo-1603851887849-5eca2b0f8fae?q=80&w=2940&auto=format&fit=crop",
    category: "Accessories",
  },
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <Layout>
      <section className="py-12 md:py-16">
        <div className="container px-4 mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-down">
            Medical Cannabis Shop
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto mb-12 animate-fade-in">
            High-quality medical cannabis products prescribed by licensed physicians, 
            delivered discreetly to your door.
          </p>
          
          <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
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
            Why Choose Dr.Ansay for Medical Cannabis?
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
