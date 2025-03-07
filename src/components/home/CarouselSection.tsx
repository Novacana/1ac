
import React from "react";
import ProductCarousel from "@/components/ProductCarousel";
import { Product } from "@/types/product";

interface CarouselSectionProps {
  products: Product[];
  selectedCategory: string;
}

const CarouselSection: React.FC<CarouselSectionProps> = ({ products, selectedCategory }) => {
  // Fix product image paths and ensure images array exists
  const productsWithFixedPaths = products.map(product => {
    // Create an images array if it doesn't exist (using the single image)
    const imagesArray = product.images || (product.image ? [product.image] : []);
    
    // Fix image paths
    const fixedImages = imagesArray.map(img => {
      // If the path starts with "public/", remove it as it's already in the public folder
      if (img.startsWith("public/")) {
        return img.replace("public/", "/");
      }
      
      // Handle other potential path issues
      if (!img.startsWith("http") && !img.startsWith("/")) {
        return "/" + img;
      }
      
      return img;
    });
    
    return { ...product, images: fixedImages };
  });

  console.log("Fixed product images in CarouselSection:", productsWithFixedPaths.map(p => p.images));

  return (
    <section className="py-4 relative">
      <div className="container px-4 mx-auto">
        <ProductCarousel products={productsWithFixedPaths} selectedCategory={selectedCategory} />
      </div>
    </section>
  );
};

export default CarouselSection;
