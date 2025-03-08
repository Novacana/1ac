
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PharmacyProductsList from "@/components/pharmacy/PharmacyProductsList";

const ProductsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Produkte</span>
          <Badge variant="outline" className="ml-2">42 Produkte</Badge>
        </CardTitle>
        <CardDescription>
          Verwalten Sie Ihre Apothekenprodukte und deren Verfügbarkeit.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PharmacyProductsList />
      </CardContent>
    </Card>
  );
};

export default ProductsTab;
