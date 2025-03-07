
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import CannabinoidProfile from "./CannabinoidProfile";
import ProductTags from "./ProductTags";

interface ProductInfoPanelProps {
  product: Product | null;
}

const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({ product }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Animate when component mounts
  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  // Early return if no product
  if (!product) return null;

  return (
    <div 
      className={cn(
        "rounded-lg p-3 transition-all duration-500 w-full mb-4",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}
    >
      <h3 className="text-sm font-medium mb-2 text-primary truncate">{product.name}</h3>
      
      {/* Cannabinoid Profile */}
      <CannabinoidProfile thc={product.thc} cbd={product.cbd} />
      
      {/* Quick info tags */}
      <ProductTags strain={product.strain} category={product.category} />
    </div>
  );
};

export default ProductInfoPanel;
