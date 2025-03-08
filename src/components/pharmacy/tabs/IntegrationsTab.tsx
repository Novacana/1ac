
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PharmacyIntegrationSettings from "@/components/pharmacy/PharmacyIntegrationSettings";

const IntegrationsTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Integrationen</span>
        </CardTitle>
        <CardDescription>
          Verbinden Sie Ihre Apothekensoftware mit unserem Shop.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PharmacyIntegrationSettings />
      </CardContent>
    </Card>
  );
};

export default IntegrationsTab;
