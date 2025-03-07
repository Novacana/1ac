
import React, { useState, useEffect, useRef } from "react";
import { Product } from "@/types/product";
import ProductInfoPanel from "./ProductInfoPanel"; 
import ProductDetailPanel from "./ProductDetailPanel";
import CarouselNavigation from "./CarouselNavigation";
import EmptyProductState from "./EmptyProductState";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ShoppingCart, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface ProductCarouselProps {
  products: Product[];
  selectedCategory: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, selectedCategory }) => {
  console.log("ProductCarousel - selectedCategory:", selectedCategory);
  console.log("ProductCarousel - products:", products);
  
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
  const [hasMoved, setHasMoved] = useState(false);
  
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const autoPlayTimerRef = useRef<number | null>(null);
  const currentImageRef = useRef<string | null>(null);
  const previousImageRef = useRef<string | null>(null);

  useEffect(() => {
    const startAutoPlay = () => {
      if (filteredProducts.length <= 1) return;
      
      if (autoPlayTimerRef.current) {
        window.clearInterval(autoPlayTimerRef.current);
      }
      
      autoPlayTimerRef.current = window.setInterval(() => {
        if (isAutoPlaying) {
          goToNext();
        }
      }, 5000);
    };
    
    startAutoPlay();
    
    return () => {
      if (autoPlayTimerRef.current) {
        window.clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [filteredProducts.length, isAutoPlaying]);
  
  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(false);
    setHasMoved(false);
    pauseAutoPlay();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    
    const currentX = e.touches[0].clientX;
    const distance = currentX - startX.current;
    setSwipeDistance(distance);
    
    if (Math.abs(distance) > 10) {
      setIsSwiping(true);
      setHasMoved(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    
    setTouchEndX(e.changedTouches[0].clientX);
    const diffX = e.changedTouches[0].clientX - startX.current;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    
    startX.current = null;
    setIsSwiping(false);
    setSwipeDistance(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setTouchStartX(e.clientX);
    setIsSwiping(true);
    setHasMoved(false);
    pauseAutoPlay();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping || startX.current === null) return;
    
    const distance = e.clientX - startX.current;
    setSwipeDistance(distance);
    
    if (Math.abs(distance) > 10) {
      setHasMoved(true);
    }
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

  const goToNext = () => {
    if (filteredProducts.length <= 1 || isTransitioning) return;
    
    const currentProduct = filteredProducts[activeIndex];
    previousImageRef.current = getImagePath(currentProduct);
    
    setDirection('next');
    setIsTransitioning(true);
    setImageLoading(true);
    
    setTimeout(() => {
      setActiveIndex(prev => (prev === filteredProducts.length - 1 ? 0 : prev + 1));
    }, 50);
    
    pauseAutoPlay();
    console.log("Going to next product, new index:", (activeIndex === filteredProducts.length - 1 ? 0 : activeIndex + 1));
  };

  const goToPrevious = () => {
    if (filteredProducts.length <= 1 || isTransitioning) return;
    
    const currentProduct = filteredProducts[activeIndex];
    previousImageRef.current = getImagePath(currentProduct);
    
    setDirection('prev');
    setIsTransitioning(true);
    setImageLoading(true);
    
    setTimeout(() => {
      setActiveIndex(prev => (prev === 0 ? filteredProducts.length - 1 : prev - 1));
    }, 50);
    
    pauseAutoPlay();
    console.log("Going to previous product, new index:", (activeIndex === 0 ? filteredProducts.length - 1 : activeIndex - 1));
  };

  const goToIndex = (index: number) => {
    if (index === activeIndex || isTransitioning) return;
    
    const currentProduct = filteredProducts[activeIndex];
    previousImageRef.current = getImagePath(currentProduct);
    
    const direction = index > activeIndex ? 'next' : 'prev';
    setDirection(direction as 'next' | 'prev');
    
    setIsTransitioning(true);
    setImageLoading(true);
    
    setTimeout(() => {
      setActiveIndex(index);
    }, 50);
    
    pauseAutoPlay();
    console.log("Going to specific index:", index);
  };

  useEffect(() => {
    console.log("Products or category changed, resetting active index");
    setActiveIndex(0);
    setImageLoading(true);
    setIsTransitioning(false);
    previousImageRef.current = null;
  }, [selectedCategory, filteredProducts.length]);

  useEffect(() => {
    if (!imageLoading && isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        previousImageRef.current = null;
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [imageLoading, isTransitioning]);

  if (filteredProducts.length === 0) {
    return <EmptyProductState />;
  }

  const activeProduct = filteredProducts[activeIndex];
  
  const getImagePath = (product: Product) => {
    if (product.images && product.images.length > 0) {
      let path = product.images[0];
      
      if (path.startsWith("public/")) {
        return path.replace("public/", "/");
      }
      
      if (!path.startsWith("http") && !path.startsWith("/")) {
        return "/" + path;
      }
      
      return path;
    } else if (product.image) {
      let path = product.image;
      
      if (path.startsWith("public/")) {
        return path.replace("public/", "/");
      }
      
      if (!path.startsWith("http") && !path.startsWith("/")) {
        return "/" + path;
      }
      
      return path;
    }
    
    return "/placeholder.svg";
  };

  const imagePath = getImagePath(activeProduct);
  console.log("Current product image path:", imagePath);

  const handleProductClick = () => {
    if (!hasMoved && filteredProducts.length > 0) {
      const productId = filteredProducts[activeIndex].id;
      console.log(`Navigating to product detail page for product ID: ${productId}`);
      navigate(`/product/${productId}`);
    }
  };
  
  const handleAddToCart = () => {
    toast.success(`${activeProduct.name} wurde zum Warenkorb hinzugefügt`);
  };

  return (
    <div className="w-full relative">
      <div className="container max-w-md mx-auto px-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-primary mt-2">{activeProduct.name}</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 bg-primary/10 border-primary/20 hover:bg-primary/20"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={14} />
              <span className="text-xs font-medium hidden sm:inline">Hinzufügen</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="md:col-span-2">
              {activeProduct && <ProductInfoPanel product={activeProduct} />}
            </div>
            
            <div className="md:col-span-3">
              <div 
                ref={containerRef}
                className="w-full h-[220px] relative overflow-hidden rounded-lg border border-border cursor-pointer"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onClick={handleProductClick}
                role="button"
                aria-label={`View details for ${activeProduct.name}`}
              >
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-card/10 backdrop-blur-sm z-10">
                    <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
                  </div>
                )}
                
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
                </div>
              </div>
            </div>
          </div>
          
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
