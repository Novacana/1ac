
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import CannabinoidProfile from "./CannabinoidProfile";
import ProductTags from "./ProductTags";
import TerpeneProfile from "./TerpeneProfile";
import FlavorProfile from "./FlavorProfile";

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
      
      {/* Combined Flavor and Terpene Profiles in a compact layout */}
      <div className="grid grid-cols-2 gap-2 mt-3">
        {product.flavors && product.flavors.length > 0 && (
          <FlavorProfile flavors={product.flavors} />
        )}
        
        {product.terpenes && product.terpenes.length > 0 && (
          <TerpeneProfile product={product} />
        )}
      </div>
    </div>
  );
};

export default ProductInfoPanel;
