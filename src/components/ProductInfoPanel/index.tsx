
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import CannabinoidProfile from "./CannabinoidProfile";
import ProductTags from "./ProductTags";
import { useIsMobile } from "@/hooks/use-mobile";
import FlavorProfile from "./FlavorProfile";

interface ProductInfoPanelProps {
  product: Product | null;
}

const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({ product }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

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
        "rounded-lg p-3 transition-all duration-500 w-full",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}
    >
      {/* Cannabinoid Profile */}
      <CannabinoidProfile thc={product.thc} cbd={product.cbd} />
      
      {/* Quick info tags */}
      <ProductTags strain={product.strain} category={product.category} />
      
      {/* Add FlavorProfile to this component if we want it to always be visible */}
      {product.flavors && product.flavors.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/30">
          <FlavorProfile flavors={product.flavors} />
        </div>
      )}
    </div>
  );
};

export default ProductInfoPanel;
