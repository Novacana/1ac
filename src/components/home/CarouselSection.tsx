
import React from "react";
import ProductCarousel from "@/components/ProductCarousel";
import { Product } from "@/types/product";

interface CarouselSectionProps {
  products: Product[];
  selectedCategory: string;
}

const CarouselSection: React.FC<CarouselSectionProps> = ({ products, selectedCategory }) => {
  // Fix product image paths
  const productsWithFixedPaths = products.map(product => {
    if (product.images) {
      const fixedImages = product.images.map(img => {
        // If the path starts with "public/", remove it as it's already in the public folder
        if (img.startsWith("public/")) {
          return img.replace("public/", "/");
        }
        return img;
      });
      return { ...product, images: fixedImages };
    }
    return product;
  });

  return (
    <section className="py-4 relative">
      <div className="container px-4 mx-auto">
        <ProductCarousel products={productsWithFixedPaths} selectedCategory={selectedCategory} />
      </div>
    </section>
  );
};

export default CarouselSection;
