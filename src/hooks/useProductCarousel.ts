
import { useEffect } from "react";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { useImageHandling } from "./carousel/useImageHandling";
import { useCarouselNavigation } from "./carousel/useCarouselNavigation";
import { useRef } from "react";

interface UseProductCarouselProps {
  products: Product[];
  selectedCategory: string;
}

export const useProductCarousel = ({ products, selectedCategory }: UseProductCarouselProps) => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const normalizedCategory = selectedCategory === "Flowers" ? "Blüten" : selectedCategory;
  
  const filteredProducts = products.filter(product => 
    product.category === normalizedCategory || product.category === selectedCategory
  );

  const {
    imageLoading,
    setImageLoading,
    updateImageLoadingState,
    getImagePath,
    previousImageRef
  } = useImageHandling({ 
    currentProduct: filteredProducts.length > 0 ? filteredProducts[0] : null 
  });

  const {
    activeIndex,
    isTransitioning,
    direction,
    isAutoPlaying,
    autoPlayTimerRef,
    setActiveIndex,
    setIsTransitioning,
    goToNext,
    goToPrevious,
    goToIndex
  } = useCarouselNavigation({
    filteredProducts,
    getImagePath,
    setImageLoading,
    previousImageRef
  });

  // Auto-play functionality
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
  }, [filteredProducts.length, isAutoPlaying, goToNext]);

  // Reset active index when products or category changes
  useEffect(() => {
    console.log("Products or category changed, resetting active index");
    setActiveIndex(0);
    setImageLoading(true);
    setIsTransitioning(false);
    previousImageRef.current = null;
  }, [selectedCategory, filteredProducts.length, setActiveIndex, setImageLoading, setIsTransitioning]);

  // Clear transition state after image loads
  useEffect(() => {
    if (!imageLoading && isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        previousImageRef.current = null;
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [imageLoading, isTransitioning, setIsTransitioning]);

  // Handle product selection
  const handleProductClick = () => {
    if (filteredProducts.length > 0) {
      const productId = filteredProducts[activeIndex].id;
      console.log(`Navigating to product detail page for product ID: ${productId}`);
      navigate(`/product/${productId}`);
    }
  };

  return {
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
  };
};
