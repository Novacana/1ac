
import React from "react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductImageCarouselProps {
  product: Product;
  imagePath: string;
  previousImagePath: string | null;
  isTransitioning: boolean;
  direction: 'next' | 'prev' | null;
  isSwiping: boolean;
  swipeDistance: number;
  imageLoading: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onMouseMove: (e: React.MouseEvent) => void;
  onMouseUp: (e: React.MouseEvent) => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({
  product,
  imagePath,
  previousImagePath,
  isTransitioning,
  direction,
  isSwiping,
  swipeDistance,
  imageLoading,
  containerRef,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseLeave,
  onClick
}) => {
  return (
    <div 
      ref={containerRef}
      className="w-full h-[300px] md:h-[400px] relative overflow-hidden rounded-lg border border-border cursor-pointer"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      role="button"
      aria-label={`View details for ${product.name}`}
    >
      {imageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/10 backdrop-blur-sm z-10">
          <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
        </div>
      )}
      
      {isTransitioning && previousImagePath && (
        <div className={cn(
          "absolute inset-0 flex items-center justify-center bg-card/5 z-0 transition-transform duration-300",
          direction === 'next' ? '-translate-x-full' : 'translate-x-full'
        )}>
          <img 
            src={previousImagePath} 
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
          alt={product.name} 
          className={cn(
            "max-h-full max-w-full object-contain p-4 transition-opacity duration-300",
            imageLoading ? "opacity-0" : "opacity-100"
          )}
          onLoad={() => {
            console.log("Image loaded successfully:", imagePath);
          }}
          onError={(e) => {
            console.error("Failed to load product image:", e);
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>
    </div>
  );
};

export default ProductImageCarousel;
