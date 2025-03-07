
import React, { useEffect, useState } from "react";
import ProductCarousel from "@/components/ProductCarousel";
import { Product } from "@/types/product";
import { toast } from "sonner";

interface CarouselSectionProps {
  products: Product[];
  selectedCategory: string;
}

const CarouselSection: React.FC<CarouselSectionProps> = ({ products, selectedCategory }) => {
  const [checkedProducts, setCheckedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
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
      
      // Check if at least one image exists and is valid
      if (fixedImages.length === 0) {
        console.warn(`Product ${product.id} (${product.name}) has no images`);
        // Add placeholder if no images
        fixedImages.push("/placeholder.svg");
      } else {
        // Preload the first image to check for errors
        const img = new Image();
        img.onerror = () => {
          console.error(`Failed to load image for product ${product.id}:`, fixedImages[0]);
        };
        img.src = fixedImages[0];
      }
      
      return { ...product, images: fixedImages };
    });

    console.log("Fixed product images in CarouselSection:", productsWithFixedPaths.map(p => ({id: p.id, name: p.name, images: p.images})));
    setCheckedProducts(productsWithFixedPaths);
  }, [products]);

  return (
    <section className="py-4 relative">
      <div className="container px-4 mx-auto">
        <ProductCarousel products={checkedProducts} selectedCategory={selectedCategory} />
      </div>
    </section>
  );
};

export default CarouselSection;
