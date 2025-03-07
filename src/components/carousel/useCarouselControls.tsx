
import { useRef, useEffect } from "react";
import { useCarousel } from "./CarouselContext";

export const useCarouselControls = () => {
  const {
    products,
    activeIndex,
    setActiveIndex,
    isAutoPlaying,
    isTransitioning,
    setIsTransitioning,
    setDirection,
    setHasMoved,
    pauseAutoPlay,
    setImageLoading
  } = useCarousel();
  
  const autoPlayTimerRef = useRef<number | null>(null);
  const startX = useRef<number | null>(null);
  const previousImageRef = useRef<string | null>(null);

  // Auto-play functionality
  useEffect(() => {
    const startAutoPlay = () => {
      if (products.length <= 1) return;
      
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
  }, [products.length, isAutoPlaying]);
  
  // Navigation functions
  const goToNext = () => {
    if (products.length <= 1 || isTransitioning) return;
    
    const currentProduct = products[activeIndex];
    previousImageRef.current = currentProduct.images?.[0] || currentProduct.image || "/placeholder.svg";
    
    setDirection('next');
    setIsTransitioning(true);
    setImageLoading(true);
    
    setTimeout(() => {
      setActiveIndex(prev => (prev === products.length - 1 ? 0 : prev + 1));
    }, 50);
    
    pauseAutoPlay();
    console.log("Going to next product, new index:", (activeIndex === products.length - 1 ? 0 : activeIndex + 1));
  };

  const goToPrevious = () => {
    if (products.length <= 1 || isTransitioning) return;
    
    const currentProduct = products[activeIndex];
    previousImageRef.current = currentProduct.images?.[0] || currentProduct.image || "/placeholder.svg";
    
    setDirection('prev');
    setIsTransitioning(true);
    setImageLoading(true);
    
    setTimeout(() => {
      setActiveIndex(prev => (prev === 0 ? products.length - 1 : prev - 1));
    }, 50);
    
    pauseAutoPlay();
    console.log("Going to previous product, new index:", (activeIndex === 0 ? products.length - 1 : activeIndex - 1));
  };

  const goToIndex = (index: number) => {
    if (index === activeIndex || isTransitioning) return;
    
    const currentProduct = products[activeIndex];
    previousImageRef.current = currentProduct.images?.[0] || currentProduct.image || "/placeholder.svg";
    
    const newDirection = index > activeIndex ? 'next' : 'prev';
    setDirection(newDirection);
    
    setIsTransitioning(true);
    setImageLoading(true);
    
    setTimeout(() => {
      setActiveIndex(index);
    }, 50);
    
    pauseAutoPlay();
    console.log("Going to specific index:", index);
  };

  // Touch and mouse event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setHasMoved(false);
    pauseAutoPlay();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    
    const currentX = e.touches[0].clientX;
    const distance = currentX - startX.current;
    
    if (Math.abs(distance) > 10) {
      setHasMoved(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    
    const diffX = e.changedTouches[0].clientX - startX.current;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    
    startX.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setHasMoved(false);
    pauseAutoPlay();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (startX.current === null) return;
    
    const distance = e.clientX - startX.current;
    
    if (Math.abs(distance) > 10) {
      setHasMoved(true);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (startX.current === null) return;
    
    const diffX = e.clientX - startX.current;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    
    startX.current = null;
  };

  const handleMouseLeave = () => {
    startX.current = null;
  };

  // Reset effects
  useEffect(() => {
    if (!isTransitioning) {
      previousImageRef.current = null;
    }
  }, [isTransitioning]);

  return {
    goToNext,
    goToPrevious,
    goToIndex,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    previousImageRef
  };
};
