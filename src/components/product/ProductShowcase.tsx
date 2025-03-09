
import React from "react";
import { Product } from "@/types/product";
import ProductInfoPanel from "../ProductInfoPanel"; 
import ProductDetailPanel from "../ProductDetailPanel";
import ProductActionButtons from "./ProductActionButtons";
import ProductImageCarousel from "./ProductImageCarousel";
import TerpeneEgg from "../ProductInfoPanel/TerpeneEgg";
import FlavorProfile from "../ProductInfoPanel/FlavorProfile";

interface ProductShowcaseProps {
  products: Product[];
  selectedCategory: string;
  activeIndex: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoToIndex: (index: number) => void;
  onProductClick: () => void;
  isSwiping: boolean;
  hasMoved: boolean;
  swipeDistance: number;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: (e: React.TouchEvent) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: (e: React.MouseEvent) => void;
  handleMouseLeave: () => void;
  isTransitioning: boolean;
  direction: 'next' | 'prev' | null;
  imageLoading: boolean;
  updateImageLoadingState: () => void;
  getImagePath: (product: Product) => string;
  previousImageRef: React.MutableRefObject<string | null>;
  containerRef: React.RefObject<HTMLDivElement>;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  products,
  selectedCategory,
  activeIndex,
  onPrevious,
  onNext,
  onGoToIndex,
  onProductClick,
  isSwiping,
  hasMoved,
  swipeDistance,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleMouseLeave,
  isTransitioning,
  direction,
  imageLoading,
  updateImageLoadingState,
  getImagePath,
  previousImageRef,
  containerRef
}) => {
  const normalizedCategory = selectedCategory === "Flowers" ? "Blüten" : selectedCategory;
  
  const filteredProducts = products.filter(product => 
    product.category === normalizedCategory || product.category === selectedCategory
  );
  
  if (filteredProducts.length === 0) {
    return null;
  }

  const activeProduct = filteredProducts[activeIndex];
  const imagePath = getImagePath(activeProduct);

  return (
    <div className="w-full max-w-screen-2xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-primary mt-2">{activeProduct.name}</h2>
          <ProductActionButtons product={activeProduct} getImagePath={getImagePath} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3 order-2 md:order-1">
            {activeProduct && (
              <>
                <ProductInfoPanel product={activeProduct} />
                
                {/* Always show flavors in a separate card if available */}
                {activeProduct.flavors && activeProduct.flavors.length > 0 && (
                  <div className="mt-4 p-3 bg-background rounded-lg border border-border/20 shadow-sm">
                    <FlavorProfile flavors={activeProduct.flavors} />
                  </div>
                )}
              </>
            )}
            
            {/* Add description on desktop view */}
            <div className="hidden md:block mt-4">
              <p className="text-sm text-muted-foreground">{activeProduct.description}</p>
            </div>
          </div>
          
          <div className="md:col-span-6 order-1 md:order-2">
            <ProductImageCarousel 
              product={activeProduct}
              imagePath={imagePath}
              previousImagePath={previousImageRef.current}
              isTransitioning={isTransitioning}
              direction={direction}
              isSwiping={isSwiping}
              swipeDistance={swipeDistance}
              imageLoading={imageLoading}
              containerRef={containerRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onClick={onProductClick}
              onImageLoad={updateImageLoadingState}
              onPrevious={onPrevious}
              onNext={onNext}
            />
          </div>
          
          <div className="md:col-span-3 order-3">
            {activeProduct && activeProduct.terpenes && activeProduct.terpenes.length > 0 && (
              <div className="rounded-lg p-4 h-full border border-border/20 bg-background shadow-sm">
                <TerpeneEgg product={activeProduct} />
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-2 md:hidden">
          {activeProduct && <ProductDetailPanel product={activeProduct} />}
        </div>
      </div>

      {/* We keep the dots for pagination but remove the side buttons */}
      <div className="flex justify-center mt-4">
        {filteredProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => onGoToIndex(index)}
            className={`h-2 w-2 mx-1 rounded-full transition-all ${
              index === activeIndex ? "bg-primary w-4" : "bg-gray-400"
            }`}
            aria-label={`Gehe zu Produkt ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductShowcase;
