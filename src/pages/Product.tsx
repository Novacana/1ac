
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductDetail, { ProductDetailProps } from "@/components/ProductDetail";
import ProductLoading from "@/components/ProductLoading";
import ProductNotFound from "@/components/ProductNotFound";
import { products, getProductById } from "@/data/products";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Fetching product with ID:", id);
    setIsLoading(true);
    
    setTimeout(() => {
      // Use the new helper function
      const foundProduct = getProductById(id || "") || null;
      console.log("Found product:", foundProduct);
      setProduct(foundProduct);
      setIsLoading(false);
    }, 500);
  }, [id]);

  if (isLoading) {
    return <ProductLoading />;
  }

  if (!product) {
    return <ProductNotFound />;
  }

  return (
    <Layout>
      <ProductDetail {...product} />
    </Layout>
  );
};

export default Product;
