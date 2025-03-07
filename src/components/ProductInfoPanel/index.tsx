
import React, { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { CannabinoidProfile } from "./CannabinoidProfile";
import { FlavorProfile } from "./FlavorProfile";
import { ProductTags } from "./ProductTags";
import { TerpeneProfile } from "./TerpeneProfile";
import { cn } from "@/lib/utils";

interface ProductInfoPanelProps {
  product: Product | null;
}

const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({ product }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Animate component when it mounts
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
      <FlavorProfile flavors={product.flavors} />
      
      {/* Quick info tags */}
      <ProductTags strain={product.strain} category={product.category} />
      
      {/* Terpene Profile */}
      <TerpeneProfile terpenes={product.terpenes} />
    </div>
  );
};

export default ProductInfoPanel;
