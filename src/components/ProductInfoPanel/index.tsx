
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import CannabinoidProfile from "./CannabinoidProfile";
import ProductTags from "./ProductTags";
import { useIsMobile } from "@/hooks/use-mobile";
import FlavorProfile from "./FlavorProfile";
import TerpeneEgg from "./TerpeneEgg";

interface ProductInfoPanelProps {
  product: Product | null;
  showOnlyTerpenes?: boolean;
}

const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({ 
  product, 
  showOnlyTerpenes = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useIsMobile();

  // Animate when component mounts
  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, []);

  // Early return if no product
  if (!product) return null;

  // If we're only showing terpenes, return just the TerpeneEgg component
  if (showOnlyTerpenes) {
    if (product.terpenes && product.terpenes.length > 0) {
      return <TerpeneEgg product={product} />;
    }
    return null;
  }

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
      
      {/* Display FlavorProfile when there are flavors available */}
      {product.flavors && product.flavors.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/30">
          <FlavorProfile flavors={product.flavors} />
        </div>
      )}
      
      {/* Always render TerpeneEgg here if terpenes are available */}
      {product.terpenes && product.terpenes.length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/30">
          <TerpeneEgg product={product} />
        </div>
      )}
    </div>
  );
};

export default ProductInfoPanel;
