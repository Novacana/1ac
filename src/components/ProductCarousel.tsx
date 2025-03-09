
import React from "react";
import { Product } from "@/types/product";
import EmptyProductState from "./EmptyProductState";
import { useProductCarousel } from "@/hooks/useProductCarousel";
import ProductShowcase from "./product/ProductShowcase";

interface ProductCarouselProps {
  products: Product[];
  selectedCategory: string;
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products, selectedCategory }) => {
  console.log("ProductCarousel - selectedCategory:", selectedCategory);
  console.log("ProductCarousel - products:", products);
  
  const {
    activeIndex,
    filteredProducts,
    goToNext,
    goToPrevious,
    goToIndex,
    handleProductClick,
    isTransitioning,
    direction,
    imageLoading,
    updateImageLoadingState,
    getImagePath,
    previousImageRef,
    containerRef
  } = useProductCarousel({ products, selectedCategory });

  if (filteredProducts.length === 0) {
    return <EmptyProductState />;
  }

  return (
    <div className="w-full relative px-4">
      <ProductShowcase
        products={products}
        selectedCategory={selectedCategory}
        activeIndex={activeIndex}
        onPrevious={goToPrevious}
        onNext={goToNext}
        onGoToIndex={goToIndex}
        onProductClick={handleProductClick}
        isTransitioning={isTransitioning}
        direction={direction}
        imageLoading={imageLoading}
        updateImageLoadingState={updateImageLoadingState}
        getImagePath={getImagePath}
        previousImageRef={previousImageRef}
        containerRef={containerRef}
      />
    </div>
  );
};

export default ProductCarousel;
