
import React from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  selectedCategory: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, selectedCategory }) => {
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
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
  );
};

export default ProductGrid;
