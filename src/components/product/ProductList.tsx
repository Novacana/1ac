
import React from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import { getImagePath } from "@/utils/product-image-utils";

interface ProductListProps {
  products: Product[];
  imagesLoaded: {[key: string]: boolean};
  setImagesLoaded: React.Dispatch<React.SetStateAction<{[key: string]: boolean}>>;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, 
  imagesLoaded, 
  setImagesLoaded 
}) => {
  return (
    <div className="w-full max-w-screen-2xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
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
    </div>
  );
};

export default ProductList;
