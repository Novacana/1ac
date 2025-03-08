
import { useState, useEffect, useRef } from "react";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";

interface UseProductCarouselProps {
  products: Product[];
  selectedCategory: string;
}

export const useProductCarousel = ({ products, selectedCategory }: UseProductCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const autoPlayTimerRef = useRef<number | null>(null);
  const previousImageRef = useRef<string | null>(null);

  const normalizedCategory = selectedCategory === "Flowers" ? "Blüten" : selectedCategory;
  
  const filteredProducts = products.filter(product => 
    product.category === normalizedCategory || product.category === selectedCategory
  );

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
  }, [filteredProducts.length, isAutoPlaying]);

  useEffect(() => {
    console.log("Products or category changed, resetting active index");
    setActiveIndex(0);
    setImageLoading(true);
    setIsTransitioning(false);
    previousImageRef.current = null;
  }, [selectedCategory, filteredProducts.length]);

  useEffect(() => {
    if (!imageLoading && isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        previousImageRef.current = null;
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [imageLoading, isTransitioning]);
  
  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setTouchStartX(e.touches[0].clientX);
    setIsSwiping(false);
    setHasMoved(false);
    pauseAutoPlay();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    
    const currentX = e.touches[0].clientX;
    const distance = currentX - startX.current;
    setSwipeDistance(distance);
    
    if (Math.abs(distance) > 10) {
      setIsSwiping(true);
      setHasMoved(true);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    
    setTouchEndX(e.changedTouches[0].clientX);
    const diffX = e.changedTouches[0].clientX - startX.current;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    
    startX.current = null;
    setIsSwiping(false);
    setSwipeDistance(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startX.current = e.clientX;
    setTouchStartX(e.clientX);
    setIsSwiping(true);
    setHasMoved(false);
    pauseAutoPlay();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSwiping || startX.current === null) return;
    
    const distance = e.clientX - startX.current;
    setSwipeDistance(distance);
    
    if (Math.abs(distance) > 10) {
      setHasMoved(true);
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isSwiping || startX.current === null) return;
    
    const diffX = e.clientX - startX.current;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        goToPrevious();
      } else {
        goToNext();
      }
    }
    
    startX.current = null;
    setIsSwiping(false);
    setSwipeDistance(0);
  };

  const handleMouseLeave = () => {
    if (isSwiping) {
      setIsSwiping(false);
      setSwipeDistance(0);
      startX.current = null;
    }
  };

  const getImagePath = (product: Product) => {
    if (product.images && product.images.length > 0) {
      let path = product.images[0];
      
      if (path.startsWith("public/")) {
        return path.replace("public/", "/");
      }
      
      if (!path.startsWith("http") && !path.startsWith("/")) {
        return "/" + path;
      }
      
      return path;
    } else if (product.image) {
      let path = product.image;
      
      if (path.startsWith("public/")) {
        return path.replace("public/", "/");
      }
      
      if (!path.startsWith("http") && !path.startsWith("/")) {
        return "/" + path;
      }
      
      return path;
    }
    
    return "/placeholder.svg";
  };

  const goToNext = () => {
    if (filteredProducts.length <= 1 || isTransitioning) return;
    
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
  };

  const goToPrevious = () => {
    if (filteredProducts.length <= 1 || isTransitioning) return;
    
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
  };

  const goToIndex = (index: number) => {
    if (index === activeIndex || isTransitioning) return;
    
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
  };

  const handleProductClick = () => {
    if (!hasMoved && filteredProducts.length > 0) {
      const productId = filteredProducts[activeIndex].id;
      console.log(`Navigating to product detail page for product ID: ${productId}`);
      navigate(`/product/${productId}`);
    }
  };

  const updateImageLoadingState = () => {
    setImageLoading(false);
  };

  return {
    activeIndex,
    filteredProducts,
    goToNext,
    goToPrevious,
    goToIndex,
    handleProductClick,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
    isSwiping,
    hasMoved,
    swipeDistance,
    isTransitioning,
    direction,
    imageLoading,
    updateImageLoadingState,
    getImagePath,
    previousImageRef,
    containerRef
  };
};
