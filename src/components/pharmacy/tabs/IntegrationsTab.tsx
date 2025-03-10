
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PharmacyIntegrationSettings from "@/components/pharmacy/PharmacyIntegrationSettings";
import { Badge } from "@/components/ui/badge";

const IntegrationsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Apothekensysteme</span>
          <Badge variant="outline" className="bg-green-100 text-green-800">
            2 Verbindungen aktiv
          </Badge>
        </CardTitle>
        <CardDescription>
          Verbinden Sie Ihre Apothekensoftware und synchronisieren Sie Ihr Inventar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PharmacyIntegrationSettings />
      </CardContent>
    </Card>
  );
};

export default IntegrationsTab;
