
import React from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import { getImagePath } from "@/utils/product-display-utils";

interface ProductListProps {
  products: Product[];
  imagesLoaded: {[key: string]: boolean};
  setImagesLoaded: (value: {[key: string]: boolean}) => void;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  imagesLoaded, 
  setImagesLoaded 
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
      {products.map((product) => {
        const imagePath = getImagePath(product);
        
        return (
          <ProductCard 
            key={product.id}
            product={product}
            imagePath={imagePath}
            imagesLoaded={imagesLoaded}
            setImagesLoaded={setImagesLoaded}
          />
        );
      })}
    </div>
  );
};

export default ProductList;
