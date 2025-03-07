
import React from "react";

interface ProductDescriptionProps {
  description: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  description,
}) => {
  return (
    <p className="text-foreground/80 leading-relaxed">{description}</p>
  );
};

export default ProductDescription;
