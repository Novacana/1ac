
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import CannabinoidProfile from "./CannabinoidProfile";
import FlavorProfile from "./FlavorProfile";
import TerpeneProfile from "./TerpeneProfile";
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
        "rounded-lg p-4 transition-all duration-500",
        "md:absolute md:top-4 md:left-4 md:z-10 md:w-72 md:max-w-[calc(100%-2rem)]",
        "bg-white/80 dark:bg-black/60 backdrop-blur-md border border-primary/10",
        "w-full mx-auto max-w-sm", // Mobile styling
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}
    >
      <h3 className="text-sm font-medium mb-2 text-primary truncate">{product.name}</h3>
      
      {/* Cannabinoid Profile */}
      <CannabinoidProfile thc={product.thc} cbd={product.cbd} />
      
      {/* Taste/Flavor Profile */}
      <FlavorProfile flavors={product.flavors} />
      
      {/* Quick info tags */}
      <ProductTags strain={product.strain} category={product.category} />
      
      {/* Terpene Profile */}
      <TerpeneProfile product={product} />
    </div>
  );
};

export default ProductInfoPanel;
