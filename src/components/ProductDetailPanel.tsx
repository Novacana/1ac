
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";

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
        "rounded-lg p-4 transition-all duration-500 w-full border-t border-border/30 pt-6 mt-4",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Additional product details can go here */}
        <div>
          <h3 className="text-lg font-medium mb-3">Produktdetails</h3>
          {product.origin && (
            <div className="mb-2">
              <span className="font-medium text-sm">Herkunft: </span>
              <span className="text-sm">{product.origin}</span>
            </div>
          )}
          {product.weight && (
            <div className="mb-2">
              <span className="font-medium text-sm">Gewicht: </span>
              <span className="text-sm">{product.weight}</span>
            </div>
          )}
          {product.potency && (
            <div className="mb-2">
              <span className="font-medium text-sm">Potenz: </span>
              <span className="text-sm">{product.potency}</span>
            </div>
          )}
        </div>
        
        <div>
          {product.use && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Anwendung</h4>
              <p className="text-sm text-foreground/80">{product.use}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPanel;
