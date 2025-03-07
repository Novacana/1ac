
import React, { useEffect, useState } from "react";
import ProductCarousel from "@/components/ProductCarousel";
import { Product } from "@/types/product";
import { FilterX } from "lucide-react";
import { getProductsByCategory } from "@/data/products";

interface CarouselSectionProps {
  products: Product[];
  selectedCategory: string;
}

const CarouselSection: React.FC<CarouselSectionProps> = ({ products, selectedCategory }) => {
  const [checkedProducts, setCheckedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Try to get products from our data directory first
    const dataProducts = getProductsByCategory(selectedCategory);
    
    if (dataProducts && dataProducts.length > 0) {
      console.log("Using products from data directory:", dataProducts.length);
      
      // Process data directory products
      const processedDataProducts = dataProducts.map(product => {
        // Ensure images is an array and fix paths
        const fixedImages = (product.images || []).map(img => {
          if (img.startsWith("public/")) {
            return img.replace("public/", "/");
          }
          return img.startsWith("/") ? img : `/${img}`;
        });
        
        // Convert to Product type to ensure compatibility
        return {
          ...product,
          image: fixedImages[0] || "/placeholder.svg", // Add required image property
          images: fixedImages.length > 0 ? fixedImages : ["/placeholder.svg"]
        } as Product;
      });
      
      setCheckedProducts(processedDataProducts);
      setIsLoading(false);
      return;
    }
    
    // Fall back to the provided products if no data directory products
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
      }
      
      return { ...product, images: fixedImages };
    });

    console.log("Fixed product images in CarouselSection:", productsWithFixedPaths.map(p => ({id: p.id, name: p.name, images: p.images})));
    setCheckedProducts(productsWithFixedPaths);
    setIsLoading(false);
  }, [products, selectedCategory]);

  // Handle loading state
  if (isLoading) {
    return (
      <section className="py-2 relative">
        <div className="container px-4 mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  // Handle empty state
  if (checkedProducts.length === 0) {
    return (
      <section className="py-2 relative">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FilterX className="h-10 w-10 text-muted-foreground mb-3" />
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
    <section className="py-2 relative">
      <div className="container px-4 mx-auto">
        <ProductCarousel products={checkedProducts} selectedCategory={selectedCategory} />
      </div>
    </section>
  );
};

export default CarouselSection;
