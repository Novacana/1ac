
import { useState, useEffect } from "react";
import { ProductDetailProps } from "@/components/ProductDetail";
import { sampleProducts } from "@/data/sampleProducts";

export const useProductDetails = (id: string | undefined) => {
  const [product, setProduct] = useState<ProductDetailProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    
    const fetchProduct = setTimeout(() => {
      const foundProduct = id ? sampleProducts.find(p => p.id === id) || null : null;
      setProduct(foundProduct);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(fetchProduct);
  }, [id]);

  return { product, isLoading };
};
