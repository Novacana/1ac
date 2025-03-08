
import { useState, useEffect, useRef } from "react";
import { Product } from "@/types/product";

export interface UseImageHandlingProps {
  currentProduct: Product | null;
}

export const useImageHandling = ({ currentProduct }: UseImageHandlingProps) => {
  const [imageLoading, setImageLoading] = useState(true);
  const previousImageRef = useRef<string | null>(null);

  const updateImageLoadingState = () => {
    console.log("Image loading completed, updating state");
    setImageLoading(false);
  };

  const getImagePath = (product: Product) => {
    if (!product) {
      console.error("No product provided to getImagePath");
      return "/placeholder.svg";
    }
    
    try {
      // First try to get from images array
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        let path = product.images[0];
        
        if (typeof path !== 'string') {
          console.error("Invalid image path type:", path);
          return "/placeholder.svg";
        }
        
        // Fix path if it starts with public/
        if (path.startsWith("public/")) {
          return path.replace("public/", "/");
        }
        
        // Add leading slash if needed
        if (!path.startsWith("http") && !path.startsWith("/")) {
          return "/" + path;
        }
        
        return path;
      }
      
      // Fall back to single image property
      if (product.image && typeof product.image === 'string') {
        let path = product.image;
        
        // Fix path if it starts with public/
        if (path.startsWith("public/")) {
          return path.replace("public/", "/");
        }
        
        // Add leading slash if needed
        if (!path.startsWith("http") && !path.startsWith("/")) {
          return "/" + path;
        }
        
        return path;
      }
    } catch (error) {
      console.error("Error processing image path:", error);
    }
    
    // Fallback to placeholder
    return "/placeholder.svg";
  };

  return {
    imageLoading,
    setImageLoading,
    updateImageLoadingState,
    getImagePath,
    previousImageRef
  };
};
