
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import ProductDetail from "@/components/ProductDetail";
import ProductLoading from "@/components/product/ProductLoading";
import ProductNotFound from "@/components/product/ProductNotFound";
import { useProductDetails } from "@/hooks/useProductDetails";

const Product = () => {
  const { id } = useParams<{ id: string }>();
  const { product, isLoading } = useProductDetails(id);

  if (isLoading) {
    return (
      <Layout>
        <ProductLoading />
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <ProductNotFound />
      </Layout>
    );
  }

  return (
    <Layout>
      <ProductDetail {...product} />
    </Layout>
  );
};

export default Product;
