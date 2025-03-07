import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { ProductDetailProps } from "@/components/ProductDetail";
import ProductModel from "@/components/ProductModel";
import EmptyProductState from "@/components/EmptyProductState";
import CarouselNavigation from "@/components/CarouselNavigation";

interface ProductCarouselProps {
  products: (Product | ProductDetailProps)[];
  selectedCategory: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products,
  selectedCategory,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const totalProducts = products.length;

  const nextProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + featuredProducts.length) % featuredProducts.length);
  };

  // Get featured products based on the selected category
  const getFeaturedProducts = () => {
    let filteredProducts;
    
    // Handle both English and German category names
    const categoryMap: { [key: string]: string[] } = {
      "Blüten": ["Flowers", "Blüten"],
      "Öle": ["Oils", "Öle"],
      "Edibles": ["Edibles"],
      "Topicals": ["Topicals"],
      "Vapes": ["Vapes"],
      "Accessories": ["Accessories", "Zubehör"],
      
      // English mappings for backward compatibility
      "Flowers": ["Flowers", "Blüten"],
      "Oils": ["Oils", "Öle"],
    };
    
    // If we have a mapping for this category, use it
    if (categoryMap[selectedCategory]) {
      const categories = categoryMap[selectedCategory];
      filteredProducts = products.filter(p => categories.includes(p.category));
    } else {
      // Fallback to exact match
      filteredProducts = products.filter(p => p.category === selectedCategory);
    }
    
    // Return 3 products or all if less than 3
    return filteredProducts.slice(0, 3);
  };

  const featuredProducts = getFeaturedProducts();
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isMounted && featuredProducts.length > 0) {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length);
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isMounted, featuredProducts.length]);

  // Get product image safely for either Product or ProductDetailProps
  const getProductImage = (product: Product | ProductDetailProps): string => {
    if ('image' in product) {
      return product.image;
    }
    return product.images?.[0] || '/placeholder.svg';
  };

  // Common product props extraction for reuse
  const getProductProps = (product: Product | ProductDetailProps) => {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      thc: product.thc,
      cbd: product.cbd,
      category: product.category,
      image: getProductImage(product)
    };
  };

  return (
    <section className="relative">
      <div className="container px-4 mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-6 w-full">
            
            <div className="relative w-full aspect-square md:h-[450px] md:w-[450px] flex-1">
              {featuredProducts.length > 0 ? (
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="h-full w-full"
                >
                  <ProductModel 
                    {...getProductProps(featuredProducts[currentIndex])}
                  />
                </motion.div>
              ) : (
                <EmptyProductState text="No products available in this category" />
              )}
            </div>
            
            
          </div>
          
          
          <div className="flex gap-4 mt-4 w-full justify-center md:justify-start">
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`relative cursor-pointer overflow-hidden rounded-md border-2 transition-all 
                  ${index === currentIndex ? 'border-primary' : 'border-transparent'}`}
                onClick={() => setCurrentIndex(index)}
              >
                <div className="h-16 w-16 md:h-20 md:w-20 relative">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform hover:scale-110"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      
      <div className="md:hidden fixed bottom-4 left-0 right-0 flex justify-center z-10">
        <CarouselNavigation
          onPrevious={prevProduct}
          onNext={nextProduct}
          hasPrevious={currentIndex > 0}
          hasNext={currentIndex < featuredProducts.length - 1}
        />
      </div>
    </section>
  );
};

export default ProductCarousel;
