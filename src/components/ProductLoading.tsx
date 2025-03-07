
import React from "react";
import Layout from "@/components/Layout";

const ProductLoading = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-24 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
      </div>
    </Layout>
  );
};

export default ProductLoading;
