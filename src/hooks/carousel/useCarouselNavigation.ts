
import { useState, useRef } from "react";
import { Product } from "@/types/product";

interface UseCarouselNavigationProps {
  filteredProducts: Product[];
  getImagePath: (product: Product) => string;
  setImageLoading: (loading: boolean) => void;
  previousImageRef: React.MutableRefObject<string | null>;
}

export const useCarouselNavigation = ({ 
  filteredProducts, 
  getImagePath, 
  setImageLoading, 
  previousImageRef 
}: UseCarouselNavigationProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const autoPlayTimerRef = useRef<number | null>(null);

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
  };

  const goToNext = () => {
    if (filteredProducts.length <= 1 || isTransitioning) return;
    
    try {
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
    } catch (error) {
      console.error("Error in goToNext:", error);
      setIsTransitioning(false);
      setImageLoading(false);
    }
  };

  const goToPrevious = () => {
    if (filteredProducts.length <= 1 || isTransitioning) return;
    
    try {
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
    } catch (error) {
      console.error("Error in goToPrevious:", error);
      setIsTransitioning(false);
      setImageLoading(false);
    }
  };

  const goToIndex = (index: number) => {
    if (index === activeIndex || isTransitioning) return;
    
    try {
      const currentProduct = filteredProducts[activeIndex];
      previousImageRef.current = getImagePath(currentProduct);
      
      const newDirection = index > activeIndex ? 'next' : 'prev';
      setDirection(newDirection as 'next' | 'prev');
      
      setIsTransitioning(true);
      setImageLoading(true);
      
      setTimeout(() => {
        setActiveIndex(index);
      }, 50);
      
      pauseAutoPlay();
      console.log("Going to specific index:", index);
    } catch (error) {
      console.error("Error in goToIndex:", error);
      setIsTransitioning(false);
      setImageLoading(false);
    }
  };

  return {
    activeIndex,
    isTransitioning,
    direction,
    isAutoPlaying,
    autoPlayTimerRef,
    setActiveIndex,
    setIsTransitioning,
    goToNext,
    goToPrevious,
    goToIndex,
    pauseAutoPlay
  };
};
