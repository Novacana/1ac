
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PharmacyProductsList from "@/components/pharmacy/PharmacyProductsList";

const ProductsTab: React.FC = () => {
  const [inventoryStats, setInventoryStats] = useState({
    total: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  useEffect(() => {
    // Simulate loading inventory statistics
    // In a real implementation, this would fetch from a pharmacy API
    setTimeout(() => {
      setInventoryStats({
        total: 42,
        lowStock: 8,
        outOfStock: 3,
      });
    }, 1000);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Apothekeninventar</span>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              {inventoryStats.total} Produkte gesamt
            </Badge>
            <Badge variant="outline" className="bg-amber-100 text-amber-800">
              {inventoryStats.lowStock} niedriger Bestand
            </Badge>
            <Badge variant="outline" className="bg-red-100 text-red-800">
              {inventoryStats.outOfStock} nicht vorrätig
            </Badge>
          </div>
        </CardTitle>
        <CardDescription>
          Verwalten Sie Ihr Apothekeninventar und Produktverfügbarkeit
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PharmacyProductsList />
      </CardContent>
    </Card>
  );
};

export default ProductsTab;
