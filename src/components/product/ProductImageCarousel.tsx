
import React from "react";
import { Product } from "@/types/product";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CarouselImage from "./carousel/CarouselImage";
import TransitionWrapper from "./carousel/TransitionWrapper";
import LoadingIndicator from "./carousel/LoadingIndicator";
import PreviousImage from "./carousel/PreviousImage";

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
  onImageLoad: () => void;
  onPrevious: () => void;
  onNext: () => void;
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
  onClick,
  onImageLoad,
  onPrevious,
  onNext
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
      <LoadingIndicator isVisible={imageLoading} />
      
      <PreviousImage 
        src={previousImagePath}
        isVisible={isTransitioning}
        direction={direction}
      />
      
      <TransitionWrapper
        isTransitioning={isTransitioning}
        direction={direction}
        isSwiping={isSwiping}
        swipeDistance={swipeDistance}
      >
        <CarouselImage
          src={imagePath}
          alt={product.name}
          isLoading={imageLoading}
          onLoad={onImageLoad}
        />
      </TransitionWrapper>
      
      {/* Navigation buttons on the image */}
      <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the container click
            onPrevious();
          }}
          className="bg-primary/80 text-white rounded-full p-2 hover:bg-primary transition-colors"
          aria-label="Vorheriges Produkt"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>
      
      <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering the container click
            onNext();
          }}
          className="bg-primary/80 text-white rounded-full p-2 hover:bg-primary transition-colors"
          aria-label="Nächstes Produkt"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ProductImageCarousel;
