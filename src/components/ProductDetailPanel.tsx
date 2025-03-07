
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import FlavorProfile from "./ProductInfoPanel/FlavorProfile";
import TerpeneProfile from "./ProductInfoPanel/TerpeneProfile";

interface ProductDetailPanelProps {
  product: Product | null;
}

const ProductDetailPanel: React.FC<ProductDetailPanelProps> = ({ product }) => {
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
        "rounded-lg p-3 transition-all duration-500 max-w-[180px]",
        "backdrop-blur-[2px] border border-primary/10",
        "ml-auto mr-4 mb-12", // Adjusted positioning
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      {/* Taste/Flavor Profile */}
      <FlavorProfile flavors={product.flavors} />
      
      {/* Terpene Profile */}
      <TerpeneProfile product={product} />
    </div>
  );
};

export default ProductDetailPanel;
