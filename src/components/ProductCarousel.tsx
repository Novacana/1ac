
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
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const autoPlayTimerRef = useRef<number | null>(null);
  const currentImageRef = useRef<string | null>(null);
  const previousImageRef = useRef<string | null>(null);

  // Auto-play functionality
  useEffect(() => {
    const startAutoPlay = () => {
      if (filteredProducts.length <= 1) return;
      
      // Clear any existing timer
      if (autoPlayTimerRef.current) {
        window.clearInterval(autoPlayTimerRef.current);
      }
      
      // Set new timer to change slides every 5 seconds
      autoPlayTimerRef.current = window.setInterval(() => {
        if (isAutoPlaying) {
          goToNext();
        }
      }, 5000);
    };
    
    startAutoPlay();
    
    // Cleanup the timer when the component unmounts
    return () => {
      if (autoPlayTimerRef.current) {
        window.clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [filteredProducts.length, isAutoPlaying]);
  
  // Pause auto-play when user interacts with carousel
  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(false);
    pauseAutoPlay();
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
    if (startX.current === null) return;
    
    setTouchEndX(e.changedTouches[0].clientX);
    const diffX = e.changedTouches[0].clientX - startX.current;
    
    // If swipe distance is significant enough, navigate
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
    pauseAutoPlay();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping || startX.current === null) return;
    
    const distance = e.clientX - startX.current;
    setSwipeDistance(distance);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isSwiping || startX.current === null) return;
    
    const diffX = e.clientX - startX.current;
    
    // If swipe distance is significant enough, navigate
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
    if (filteredProducts.length <= 1 || isTransitioning) return;
    
    // Store the current image path for transition
    const currentProduct = filteredProducts[activeIndex];
    previousImageRef.current = getImagePath(currentProduct);
    
    // Set transition state
    setDirection('next');
    setIsTransitioning(true);
    setImageLoading(true);
    
    // After a short delay, update the active index
    setTimeout(() => {
      setActiveIndex(prev => (prev === filteredProducts.length - 1 ? 0 : prev + 1));
    }, 50);
    
    pauseAutoPlay();
    console.log("Going to next product, new index:", (activeIndex === filteredProducts.length - 1 ? 0 : activeIndex + 1));
  };

  const goToPrevious = () => {
    if (filteredProducts.length <= 1 || isTransitioning) return;
    
    // Store the current image path for transition
    const currentProduct = filteredProducts[activeIndex];
    previousImageRef.current = getImagePath(currentProduct);
    
    // Set transition state
    setDirection('prev');
    setIsTransitioning(true);
    setImageLoading(true);
    
    // After a short delay, update the active index
    setTimeout(() => {
      setActiveIndex(prev => (prev === 0 ? filteredProducts.length - 1 : prev - 1));
    }, 50);
    
    pauseAutoPlay();
    console.log("Going to previous product, new index:", (activeIndex === 0 ? filteredProducts.length - 1 : activeIndex - 1));
  };

  const goToIndex = (index: number) => {
    if (index === activeIndex || isTransitioning) return;
    
    // Store the current image path for transition
    const currentProduct = filteredProducts[activeIndex];
    previousImageRef.current = getImagePath(currentProduct);
    
    // Determine direction for animation
    const direction = index > activeIndex ? 'next' : 'prev';
    setDirection(direction as 'next' | 'prev');
    
    // Set transition state
    setIsTransitioning(true);
    setImageLoading(true);
    
    // After a short delay, update the active index
    setTimeout(() => {
      setActiveIndex(index);
    }, 50);
    
    pauseAutoPlay();
    console.log("Going to specific index:", index);
  };

  // Reset active index when category changes or products change
  useEffect(() => {
    console.log("Products or category changed, resetting active index");
    setActiveIndex(0);
    setImageLoading(true);
    setIsTransitioning(false);
    previousImageRef.current = null;
  }, [selectedCategory, filteredProducts.length]);

  // Reset transition state after image loads
  useEffect(() => {
    if (!imageLoading && isTransitioning) {
      // Reset transition state after animation completes
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        previousImageRef.current = null;
      }, 500); // Match this to the CSS transition duration
      
      return () => clearTimeout(timer);
    }
  }, [imageLoading, isTransitioning]);

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
        <div className="flex flex-col gap-2">
          {/* Product name and main info */}
          <h2 className="text-xl font-semibold text-primary mt-2">{activeProduct.name}</h2>
          
          {/* Two-column layout for info panels and image */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {/* Left column: Cannabinoid info & tags */}
            <div className="md:col-span-2">
              {activeProduct && <ProductInfoPanel product={activeProduct} />}
            </div>
            
            {/* Right column: Product image */}
            <div className="md:col-span-3">
              <div 
                ref={containerRef}
                className="w-full h-[220px] relative overflow-hidden rounded-lg border border-border"
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
                    <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
                  </div>
                )}
                
                {/* Previous image for transition effect */}
                {isTransitioning && previousImageRef.current && (
                  <div className={cn(
                    "absolute inset-0 flex items-center justify-center bg-card/5 z-0 transition-transform duration-300",
                    direction === 'next' ? '-translate-x-full' : 'translate-x-full'
                  )}>
                    <img 
                      src={previousImageRef.current} 
                      alt="Previous product" 
                      className="max-h-full max-w-full object-contain p-4"
                    />
                  </div>
                )}
                
                {/* Main swipeable product image */}
                <div 
                  className={cn(
                    "w-full h-full flex items-center justify-center transition-all duration-300 relative bg-card/5 backdrop-blur-sm",
                    isSwiping 
                      ? `transform translate-x-[${swipeDistance}px]` 
                      : isTransitioning 
                        ? cn("transform", direction === 'next' ? 'translate-x-full' : '-translate-x-full', 'animate-slide-in')
                        : 'translate-x-0'
                  )}
                  style={{ 
                    transform: isSwiping 
                      ? `translateX(${swipeDistance}px)` 
                      : undefined 
                  }}
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
            </div>
          </div>
          
          {/* Bottom detail panel - Terpenes & flavors */}
          <div className="mt-2">
            {activeProduct && <ProductDetailPanel product={activeProduct} />}
          </div>
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
