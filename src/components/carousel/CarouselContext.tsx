
import React, { createContext, useContext, useState } from "react";
import { Product } from "@/types/product";

interface CarouselContextType {
  products: Product[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  isAutoPlaying: boolean;
  setIsAutoPlaying: (isPlaying: boolean) => void;
  isTransitioning: boolean;
  setIsTransitioning: (isTransitioning: boolean) => void;
  direction: 'next' | 'prev' | null;
  setDirection: (direction: 'next' | 'prev' | null) => void;
  hasMoved: boolean;
  setHasMoved: (hasMoved: boolean) => void;
  pauseAutoPlay: () => void;
  imageLoading: boolean;
  setImageLoading: (loading: boolean) => void;
  getImagePath: (product: Product) => string;
}

const CarouselContext = createContext<CarouselContextType | undefined>(undefined);

export const CarouselProvider: React.FC<{
  children: React.ReactNode;
  products: Product[];
  selectedCategory: string;
}> = ({ children, products, selectedCategory }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev' | null>(null);
  const [hasMoved, setHasMoved] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Normalize category name
  const normalizedCategory = selectedCategory === "Flowers" ? "Blüten" : selectedCategory;
  
  // Filter products by category
  const filteredProducts = products.filter(product => 
    product.category === normalizedCategory || product.category === selectedCategory
  );

  console.log("CarouselContext - filteredProducts:", filteredProducts);

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false);
    
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);
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

  return (
    <CarouselContext.Provider
      value={{
        products: filteredProducts,
        activeIndex,
        setActiveIndex,
        isAutoPlaying,
        setIsAutoPlaying,
        isTransitioning,
        setIsTransitioning,
        direction,
        setDirection,
        hasMoved,
        setHasMoved,
        pauseAutoPlay,
        imageLoading,
        setImageLoading,
        getImagePath
      }}
    >
      {children}
    </CarouselContext.Provider>
  );
};

export const useCarousel = () => {
  const context = useContext(CarouselContext);
  if (context === undefined) {
    throw new Error("useCarousel must be used within a CarouselProvider");
  }
  return context;
};
