
import React, { useState, useEffect, useRef } from "react";
import { Product } from "@/types/product";
import ProductInfoPanel from "./ProductInfoPanel"; 
import ProductDetailPanel from "./ProductDetailPanel";
import CarouselNavigation from "./CarouselNavigation";
import EmptyProductState from "./EmptyProductState";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCarouselProps {
  products: Product[];
  selectedCategory: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, selectedCategory }) => {
  console.log("ProductCarousel - selectedCategory:", selectedCategory);
  console.log("ProductCarousel - products:", products);
  
  // Wandle die Kategorie "Flowers" zu "Blüten" um, wenn wir die deutsche Version verwenden
  const normalizedCategory = selectedCategory === "Flowers" ? "Blüten" : selectedCategory;
  
  const filteredProducts = products.filter(product => 
    product.category === normalizedCategory || product.category === selectedCategory
  );
  console.log("ProductCarousel - filteredProducts:", filteredProducts);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    
    const currentX = e.touches[0].clientX;
    const distance = currentX - startX.current;
    setSwipeDistance(distance);
    
    // If the user has moved more than 10px, consider it a swipe
    if (Math.abs(distance) > 10) {
      setIsSwiping(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null || !isSwiping) return;
    
    setTouchEndX(e.changedTouches[0].clientX);
    const diffX = e.changedTouches[0].clientX - startX.current;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    
    // Reset swipe state
    startX.current = null;
    setIsSwiping(false);
    setSwipeDistance(0);
  };

  // Mouse event handlers for desktop swipe simulation
  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setTouchStartX(e.clientX);
    setIsSwiping(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping || startX.current === null) return;
    
    const distance = e.clientX - startX.current;
    setSwipeDistance(distance);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isSwiping || startX.current === null) return;
    
    const diffX = e.clientX - startX.current;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    
    // Reset swipe state
    startX.current = null;
    setIsSwiping(false);
    setSwipeDistance(0);
  };

  const handleMouseLeave = () => {
    if (isSwiping) {
      setIsSwiping(false);
      setSwipeDistance(0);
      startX.current = null;
    }
  };

  // Navigation functions
  const goToNext = () => {
    setActiveIndex(prev => (prev === filteredProducts.length - 1 ? 0 : prev + 1));
    setImageLoading(true);
  };

  const goToPrevious = () => {
    setActiveIndex(prev => (prev === 0 ? filteredProducts.length - 1 : prev - 1));
    setImageLoading(true);
  };

  const goToIndex = (index: number) => {
    setActiveIndex(index);
    setImageLoading(true);
  };

  // Reset active index when category changes
  useEffect(() => {
    setActiveIndex(0);
    setImageLoading(true);
  }, [selectedCategory]);

  // If no products, show empty state
  if (filteredProducts.length === 0) {
    return <EmptyProductState />;
  }

  const activeProduct = filteredProducts[activeIndex];
  
  // Get the correctly formatted image path
  const getImagePath = (product: Product) => {
    if (product.images && product.images.length > 0) {
      let path = product.images[0];
      
      // Fix path if it starts with "public/"
      if (path.startsWith("public/")) {
        return path.replace("public/", "/");
      }
      
      // Add leading slash if needed
      if (!path.startsWith("http") && !path.startsWith("/")) {
        return "/" + path;
      }
      
      return path;
    } else if (product.image) {
      let path = product.image;
      
      // Fix path if it starts with "public/"
      if (path.startsWith("public/")) {
        return path.replace("public/", "/");
      }
      
      // Add leading slash if needed
      if (!path.startsWith("http") && !path.startsWith("/")) {
        return "/" + path;
      }
      
      return path;
    }
    
    return "/placeholder.svg";
  };

  const imagePath = getImagePath(activeProduct);
  console.log("Current product image path:", imagePath);

  return (
    <div className="w-full relative">
      <div className="container max-w-md mx-auto px-4">
        {/* Top info panel - Cannabinoid info & tags */}
        {activeProduct && <ProductInfoPanel product={activeProduct} />}
        
        {/* Swipeable product image section */}
        <div 
          ref={containerRef}
          className="w-full h-[300px] relative overflow-hidden rounded-lg border border-border"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {/* Loading spinner */}
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-card/10 backdrop-blur-sm z-10">
              <div className="h-12 w-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
            </div>
          )}
          
          {/* Main swipeable product image */}
          <div 
            className="w-full h-full flex items-center justify-center transition-transform duration-300 relative bg-card/5 backdrop-blur-sm"
            style={{ transform: isSwiping ? `translateX(${swipeDistance}px)` : 'translateX(0)' }}
          >
            <img 
              src={imagePath} 
              alt={activeProduct.name} 
              className={cn(
                "max-h-full max-w-full object-contain p-4 transition-opacity duration-300",
                imageLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => {
                console.log("Image loaded successfully:", imagePath);
                setImageLoading(false);
              }}
              onError={(e) => {
                console.error("Failed to load product image:", e);
                (e.target as HTMLImageElement).src = "/placeholder.svg";
                setImageLoading(false);
              }}
            />
            
            {/* Swipe hint on first render - fades out after 2 seconds */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none md:hidden opacity-50 animate-fade-out">
              <div className="flex items-center gap-2 bg-background/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                <ChevronLeft size={16} className="animate-pulse" />
                <span className="text-sm font-medium">Swipe</span>
                <ChevronRight size={16} className="animate-pulse" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom detail panel - Terpenes & flavors */}
        {activeProduct && <ProductDetailPanel product={activeProduct} />}
      </div>

      <CarouselNavigation
        activeIndex={activeIndex}
        totalItems={filteredProducts.length}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onDotClick={goToIndex}
      />
    </div>
  );
};

export default ProductCarousel;
