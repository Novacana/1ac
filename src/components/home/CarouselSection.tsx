
import React from "react";
import ProductCarousel from "@/components/ProductCarousel";
import { Product } from "@/types/product";

interface CarouselSectionProps {
  products: Product[];
  selectedCategory: string;
}

const CarouselSection: React.FC<CarouselSectionProps> = ({ products, selectedCategory }) => {
  return (
    <section className="py-4 relative">
      <div className="container px-4 mx-auto">
        <ProductCarousel products={products} selectedCategory={selectedCategory} />
      </div>
    </section>
  );
};

export default CarouselSection;
