
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
        "rounded-lg p-2 transition-all duration-500 w-full border-t border-border/30 pt-2",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Taste/Flavor Profile */}
        <div>
          <FlavorProfile flavors={product.flavors} />
        </div>
        
        {/* Terpene Profile */}
        <div>
          <TerpeneProfile product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPanel;
