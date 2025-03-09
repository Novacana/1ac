
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PharmacyProductsList from "@/components/pharmacy/PharmacyProductsList";

const ProductsTab: React.FC = () => {
  const [partnerProductCount, setPartnerProductCount] = useState<number | null>(null);

  useEffect(() => {
    // Simulate loading partner products count
    // In a real implementation, this would fetch from a partner products API
    setTimeout(() => {
      setPartnerProductCount(12); // Example count
    }, 1000);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Produkte von Partnern</span>
          <Badge variant="outline" className="ml-2">
            {partnerProductCount !== null 
              ? `${partnerProductCount} Produkte` 
              : "Laden..."
            }
          </Badge>
        </CardTitle>
        <CardDescription>
          Verwalten Sie Produkte Ihrer Partner und deren Verfügbarkeit im Shop.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PharmacyProductsList />
      </CardContent>
    </Card>
  );
};

export default ProductsTab;
