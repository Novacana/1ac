
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

  // We're not using this component anymore, so return null in all cases
  return null;
};

export default ProductDetailPanel;
