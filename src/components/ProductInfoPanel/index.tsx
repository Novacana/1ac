
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
        "rounded-lg p-2 transition-all duration-500 w-full",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}
    >
      {/* Cannabinoid Profile */}
      <CannabinoidProfile thc={product.thc} cbd={product.cbd} />
      
      {/* Quick info tags */}
      <ProductTags strain={product.strain} category={product.category} />
      
      {/* Product Description (desktop only) */}
      <div className="mt-3 hidden md:block">
        <h4 className="text-xs font-medium mb-1">Beschreibung</h4>
        <p className="text-xs text-foreground/80 line-clamp-6">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductInfoPanel;
