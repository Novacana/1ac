
import React from "react";

interface ProductHeaderProps {
  name: string;
  price: number;
  category: string;
  thc?: string;
  cbd?: string;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({
  name,
  price,
  category,
  thc,
  cbd,
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-secondary text-xs px-3 py-1 rounded-full text-secondary-foreground">
          {category}
        </span>
        {(thc || cbd) && (
          <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
            {thc && `THC: ${thc}`}
            {thc && cbd && " | "}
            {cbd && `CBD: ${cbd}`}
          </span>
        )}
      </div>
      <h1 className="text-3xl font-bold">{name}</h1>
      <p className="text-2xl font-bold mt-2">€{price.toFixed(2)}</p>
    </div>
  );
};

export default ProductHeader;
