
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

interface CarouselImageProps {
  src: string;
  alt: string;
  isLoading: boolean;
  onLoad: () => void;
  className?: string;
}

const CarouselImage: React.FC<CarouselImageProps> = ({
  src,
  alt,
  isLoading,
  onLoad,
  className
}) => {
  // Preload image to ensure it's ready before displaying
  useEffect(() => {
    if (src) {
      const img = new Image();
      img.onload = () => {
        console.log("Image preloaded successfully:", src);
        onLoad();
      };
      img.onerror = (e) => {
        console.error("Failed to preload image:", src, e);
        onLoad(); // Still mark as loaded so the UI doesn't get stuck
      };
      img.src = src;
    }
  }, [src, onLoad]);

  return (
    <img 
      src={src} 
      alt={alt} 
      className={cn(
        "max-h-full max-w-full object-contain p-4 transition-opacity duration-300",
        isLoading ? "opacity-0" : "opacity-100",
        className
      )}
      onLoad={() => {
        console.log("Image loaded successfully in DOM:", src);
        onLoad();
      }}
      onError={(e) => {
        console.error("Failed to load image:", src);
        (e.target as HTMLImageElement).src = "/placeholder.svg";
        onLoad();
      }}
    />
  );
};

export default CarouselImage;
