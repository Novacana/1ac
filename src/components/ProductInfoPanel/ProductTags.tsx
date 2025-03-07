
import React from "react";

interface ProductTagsProps {
  strain?: string;
  category: string;
}

const ProductTags: React.FC<ProductTagsProps> = ({ strain, category }) => {
  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {strain && (
        <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full">
          {strain}
        </span>
      )}
      <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full">
        {category}
      </span>
    </div>
  );
};

export default ProductTags;
