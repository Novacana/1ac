
import React, { useEffect, useState } from "react";
import ProductCarousel from "@/components/ProductCarousel";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { FilterX } from "lucide-react";

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

  // Handle empty state
  if (checkedProducts.length === 0) {
    return (
      <section className="py-4 relative">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FilterX className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Keine Produkte gefunden</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Es wurden keine Produkte gefunden, die Ihren Filterkriterien entsprechen. Bitte passen Sie Ihre Filter an oder wählen Sie eine andere Kategorie.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-4 relative">
      <div className="container px-4 mx-auto">
        <ProductCarousel products={checkedProducts} selectedCategory={selectedCategory} />
      </div>
    </section>
  );
};

export default CarouselSection;
