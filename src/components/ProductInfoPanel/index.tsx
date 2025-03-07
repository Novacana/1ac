
import React, { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { CannabinoidProfile } from "./CannabinoidProfile";
import { FlavorProfile } from "./FlavorProfile";
import { ProductTags } from "./ProductT ags";
import { TerpeneProfile } from "./TerpeneProfile";

interface ProductInfoPanelProps {
  product: Product | null;
}

const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({ product }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
      <CannabinoidProfile product={product} />
      <FlavorProfile flavors={product.flavors} />
      <ProductTags product={product} />
      <TerpeneProfile terpenes={product.terpenes} />
    </div>
  );
};

export default ProductInfoPanel;
