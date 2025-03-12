
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Building } from "lucide-react";

// Import individual pharmacist accordion item components
import ProductManagementItem from "./pharmacist/ProductManagementItem";
import OrderManagementItem from "./pharmacist/OrderManagementItem";
import IntegrationsItem from "./pharmacist/IntegrationsItem";
import PrescriptionProcessingItem from "./pharmacist/PrescriptionProcessingItem";

const PharmacistTabContent: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Apotheken-Management
        </CardTitle>
        <CardDescription>
          Anleitung zur Verwaltung Ihrer Apotheke auf der Plattform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <Accordion type="single" collapsible className="w-full">
            <ProductManagementItem />
            <OrderManagementItem />
            <IntegrationsItem />
            <PrescriptionProcessingItem />
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default PharmacistTabContent;
