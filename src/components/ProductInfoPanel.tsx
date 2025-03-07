
import React, { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import CannabinoidProfile from "./product/CannabinoidProfile";
import FlavorTags from "./product/FlavorTags";
import TerpeneProfile from "./product/TerpeneProfile";

interface ProductInfoPanelProps {
  product: Product | null;
}

const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({ product }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Animate panel when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Early return if no product
  if (!product) return null;

  return (
    <div 
      className={cn(
        "absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-md rounded-lg p-4 shadow-lg border border-primary/20",
        "w-64 max-w-[calc(100%-2rem)] transition-all duration-500",
        "lg:w-72",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}
    >
      <h3 className="text-sm font-medium mb-2 text-primary truncate">{product.name}</h3>
      
      {/* Cannabinoid Profile */}
      <CannabinoidProfile thc={product.thc} cbd={product.cbd} />
      
      {/* Taste/Flavor Profile */}
      <FlavorTags flavors={product.flavors} />
      
      {/* Quick info tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {product.strain && (
          <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full">
            {product.strain}
          </span>
        )}
        <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full">
          {product.category}
        </span>
      </div>
      
      {/* Terpene Profile */}
      <TerpeneProfile terpenes={product.terpenes} />
    </div>
  );
};

export default ProductInfoPanel;
