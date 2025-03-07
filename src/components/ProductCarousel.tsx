
import React from "react";
import { Product } from "@/types/product";
import CarouselContainer from "./carousel/CarouselContainer";

interface ProductCarouselProps {
  products: Product[];
  selectedCategory: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, selectedCategory }) => {
  return <CarouselContainer products={products} selectedCategory={selectedCategory} />;
};

export default ProductCarousel;
