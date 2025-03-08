
import React from "react";

interface ProductInfoProps {
  name: string;
  productPrice: number;
  category?: string;
  thc?: string;
  cbd?: string;
  packageSize?: number;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  productPrice,
  category,
  thc,
  cbd,
  packageSize = 10
}) => {
  return (
    <div className="mb-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {category && (
          <span className="bg-background text-foreground rounded-full px-4 py-1 text-sm font-medium border border-border/40">
            {category}
          </span>
        )}
        {(thc || cbd) && (
          <span className="bg-green-500 text-white rounded-full px-4 py-1 text-sm font-medium">
            {thc && `THC: ${thc}`} {thc && cbd && "| "} {cbd && `CBD: ${cbd}`}
          </span>
        )}
      </div>
      
      <div className="flex flex-wrap justify-between items-baseline gap-2 mt-2">
        <h1 className="text-3xl font-bold text-foreground">{name}</h1>
        <div className="text-2xl font-bold text-foreground whitespace-nowrap">
          €{productPrice.toFixed(2)}
          <span className="text-sm font-normal text-muted-foreground ml-1">/ {packageSize}g</span>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
