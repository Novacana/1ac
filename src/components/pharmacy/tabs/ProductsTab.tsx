
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PharmacyProductsList from "@/components/pharmacy/PharmacyProductsList";
import { Product } from "@/types/product";

const ProductsTab: React.FC = () => {
  const [integrationProductCount, setIntegrationProductCount] = useState<number | null>(null);

  useEffect(() => {
    const countIntegrationProducts = async () => {
      try {
        const { loadProductsFromAllSources } = await import("@/hooks/useProductSources");
        const { allProducts } = await loadProductsFromAllSources("All", false);
        
        // Count only products from integrations
        const integrationProducts = allProducts.filter(product => 
          product.source === "woocommerce" || product.source === "shopify"
        );
        
        setIntegrationProductCount(integrationProducts.length);
      } catch (error) {
        console.error("Error counting integration products:", error);
      }
    };

    countIntegrationProducts();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Produkte aus Integrationen</span>
          <Badge variant="outline" className="ml-2">
            {integrationProductCount !== null 
              ? `${integrationProductCount} Produkte` 
              : "Laden..."
            }
          </Badge>
        </CardTitle>
        <CardDescription>
          Verwalten Sie Produkte aus Ihren Integrationen und deren Verfügbarkeit im Shop.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PharmacyProductsList />
      </CardContent>
    </Card>
  );
};

export default ProductsTab;
