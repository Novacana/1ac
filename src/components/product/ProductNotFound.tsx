
import React from "react";
import { Link } from "react-router-dom";

const ProductNotFound: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
      <p className="text-foreground/70 mb-8">
        The product you're looking for doesn't exist or has been removed.
      </p>
      <Link to="/" className="text-primary hover:underline">
        Browse our products
      </Link>
    </div>
  );
};

export default ProductNotFound;
