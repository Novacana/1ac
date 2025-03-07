
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import CannabinoidProfile from "./CannabinoidProfile";
import ProductTags from "./ProductTags";
import FlavorProfile from "./FlavorProfile";
import TerpeneProfile from "./TerpeneProfile";

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
        "rounded-lg p-4 transition-all duration-500 w-full",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}
    >
      <div className="grid md:grid-cols-2 gap-x-8 gap-y-4">
        <div>
          {/* Cannabinoid Profile */}
          <CannabinoidProfile thc={product.thc} cbd={product.cbd} />
          
          {/* Quick info tags */}
          <ProductTags strain={product.strain} category={product.category} />
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          {/* Flavor Profile */}
          <div>
            <FlavorProfile flavors={product.flavors} />
          </div>
          
          {/* Terpene Profile */}
          <div>
            <TerpeneProfile product={product} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoPanel;
