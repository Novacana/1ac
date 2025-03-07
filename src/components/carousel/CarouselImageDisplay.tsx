
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useCarousel } from "./CarouselContext";
import { useCarouselControls } from "./useCarouselControls";
import { useNavigate } from "react-router-dom";

const CarouselImageDisplay: React.FC = () => {
  const {
    products,
    activeIndex,
    isTransitioning,
    direction,
    hasMoved,
    imageLoading,
    setImageLoading,
    getImagePath,
    setIsTransitioning
  } = useCarousel();
  
  const {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    previousImageRef
  } = useCarouselControls();

  const navigate = useNavigate();
  
  const activeProduct = products[activeIndex];
  const imagePath = getImagePath(activeProduct);
  
  useEffect(() => {
    if (!imageLoading && isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [imageLoading, isTransitioning, setIsTransitioning]);

  const handleProductClick = () => {
    if (!hasMoved && products.length > 0) {
      const productId = products[activeIndex].id;
      console.log(`Navigating to product detail page for product ID: ${productId}`);
      navigate(`/product/${productId}`);
    }
  };
  
  return (
    <div 
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
          isTransitioning 
            ? cn("transform", direction === 'next' ? 'translate-x-full' : '-translate-x-full', 'animate-slide-in')
            : 'translate-x-0'
        )}
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
  );
};

export default CarouselImageDisplay;
