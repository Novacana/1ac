
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductDetailPanelProps {
  product: Product | null;
}

const ProductDetailPanel: React.FC<ProductDetailPanelProps> = ({ product }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  // Animate when component mounts
  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  // Early return if no product or on mobile (we don't need this panel on mobile anymore)
  if (!product || isMobile) return null;

  return (
    <div 
      className={cn(
        "rounded-lg p-2 transition-all duration-500 w-full border-t border-border/30 pt-2",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      {/* This panel is now only shown on desktop and its contents have been moved */}
      {/* to ProductDetail.tsx for better organization */}
    </div>
  );
};

export default ProductDetailPanel;
