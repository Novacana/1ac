
import React from "react";

const ProductLoading: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-24 flex items-center justify-center">
      <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
    </div>
  );
};

export default ProductLoading;
