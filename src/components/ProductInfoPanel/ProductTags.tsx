
import React from "react";
import { Product } from "@/types/product";

interface ProductTagsProps {
  product: Product;
}

export const ProductTags: React.FC<ProductTagsProps> = ({ product }) => {
  return (
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
  );
};
