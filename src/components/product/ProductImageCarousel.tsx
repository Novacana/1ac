
import React from "react";
import { Product } from "@/types/product";
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
  onImageLoad
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
    </div>
  );
};

export default ProductImageCarousel;
