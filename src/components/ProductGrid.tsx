
import React from "react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <h3 className="text-xl font-medium mb-2">No products found</h3>
        <p className="text-muted-foreground">
          We couldn't find any products in this category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
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
  );
};

export default ProductGrid;
