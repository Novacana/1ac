
import React from "react";
import Layout from "@/components/Layout";
import { products } from "@/data/products";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import EmptyProductState from "@/components/EmptyProductState";

const Products = () => {
  if (!products || products.length === 0) {
    return <EmptyProductState message="Keine Produkte gefunden" />;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Unsere Produkte</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden rounded-t-lg">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg"} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                    <p className="font-medium">{product.price.toFixed(2)} €</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Products;
