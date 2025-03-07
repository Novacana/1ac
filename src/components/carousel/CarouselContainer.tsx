
import React, { useEffect } from "react";
import { CarouselProvider } from "./CarouselContext";
import CarouselHeader from "./CarouselHeader";
import CarouselImageDisplay from "./CarouselImageDisplay";
import ProductInfoPanel from "@/components/ProductInfoPanel";
import ProductDetailPanel from "@/components/ProductDetailPanel";
import CarouselNavigation from "@/components/CarouselNavigation";
import EmptyProductState from "@/components/EmptyProductState";
import { Product } from "@/types/product";
import { useCarousel } from "./CarouselContext";

interface CarouselContainerProps {
  products: Product[];
  selectedCategory: string;
}

// Inner component that uses the context
const CarouselContent: React.FC = () => {
  const { products, activeIndex, setActiveIndex, setImageLoading, setIsTransitioning } = useCarousel();
  
  useEffect(() => {
    console.log("Products or category changed, resetting active index");
    setActiveIndex(0);
    setImageLoading(true);
    setIsTransitioning(false);
  }, [products]);

  if (products.length === 0) {
    return <EmptyProductState />;
  }

  const activeProduct = products[activeIndex];

  return (
    <div className="w-full relative">
      <div className="container max-w-md mx-auto px-4">
        <div className="flex flex-col gap-2">
          <CarouselHeader />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <div className="md:col-span-2">
              {activeProduct && <ProductInfoPanel product={activeProduct} />}
            </div>
            
            <div className="md:col-span-3">
              <CarouselImageDisplay />
            </div>
          </div>
          
          <div className="mt-2">
            {activeProduct && <ProductDetailPanel product={activeProduct} />}
          </div>
        </div>
      </div>

      <CarouselNavigation
        activeIndex={activeIndex}
        totalItems={products.length}
        onPrevious={() => {
          const controls = require('./useCarouselControls');
          controls.useCarouselControls().goToPrevious();
        }}
        onNext={() => {
          const controls = require('./useCarouselControls');
          controls.useCarouselControls().goToNext();
        }}
        onDotClick={(index) => {
          const controls = require('./useCarouselControls');
          controls.useCarouselControls().goToIndex(index);
        }}
      />
    </div>
  );
};

// Main exported component that wraps with provider
const CarouselContainer: React.FC<CarouselContainerProps> = ({ products, selectedCategory }) => {
  console.log("CarouselContainer - selectedCategory:", selectedCategory);
  console.log("CarouselContainer - products:", products);
  
  return (
    <CarouselProvider products={products} selectedCategory={selectedCategory}>
      <CarouselContent />
    </CarouselProvider>
  );
};

export default CarouselContainer;
