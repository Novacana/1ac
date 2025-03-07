
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
  };

  const goToPrevious = () => {
    setActiveIndex(prev => (prev === 0 ? filteredProducts.length - 1 : prev - 1));
  };

  const goToIndex = (index: number) => {
    setActiveIndex(index);
  };

  // Reset active index when category changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedCategory]);

  // If no products, show empty state
  if (filteredProducts.length === 0) {
    return <EmptyProductState />;
  }

  const activeProduct = filteredProducts[activeIndex];
  // Get product images with fallback
  const productImages = activeProduct.images || (activeProduct.image ? [activeProduct.image] : []);

  return (
    <div className="w-full relative">
      <div 
        ref={containerRef}
        className="w-full h-[400px] md:h-[500px] relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {/* Top left info panel - Main cannabinoid info */}
        <div className="absolute top-0 left-0 z-10 pointer-events-none">
          {activeProduct && <ProductInfoPanel product={activeProduct} />}
        </div>
        
        {/* Main swipeable product image */}
        <div 
          className="w-full h-full flex items-center justify-center transition-transform duration-300 relative"
          style={{ transform: isSwiping ? `translateX(${swipeDistance}px)` : 'translateX(0)' }}
        >
          {productImages.length > 0 ? (
            <img 
              src={productImages[0]} 
              alt={activeProduct.name} 
              className="max-h-full max-w-full object-contain p-12"
              onError={(e) => {
                console.error("Failed to load product image:", e);
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
          ) : (
            <div className="flex items-center justify-center text-muted-foreground">
              Kein Bild verfügbar
            </div>
          )}
          
          {/* Swipe indicators - only visible on desktop */}
          <div className="absolute inset-x-0 flex justify-between px-4 pointer-events-none hidden md:flex">
            <button 
              onClick={goToPrevious}
              className="bg-background/80 backdrop-blur-sm rounded-full p-3 text-primary pointer-events-auto opacity-75 hover:opacity-100 transition-opacity"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={goToNext}
              className="bg-background/80 backdrop-blur-sm rounded-full p-3 text-primary pointer-events-auto opacity-75 hover:opacity-100 transition-opacity"
            >
              <ChevronRight size={24} />
            </button>
          </div>
          
          {/* Swipe hint on first render - fades out after 2 seconds */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none md:hidden opacity-50 animate-fade-out">
            <div className="flex items-center gap-2 bg-background/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <ChevronLeft size={16} className="animate-pulse" />
              <span className="text-sm font-medium">Swipe</span>
              <ChevronRight size={16} className="animate-pulse" />
            </div>
          </div>
        </div>
        
        {/* Bottom right detail panel - Terpenes & taste */}
        <div className="absolute bottom-0 right-0 z-10 pointer-events-none">
          {activeProduct && <ProductDetailPanel product={activeProduct} />}
        </div>
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
