
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SystemsTab from "./tabs/SystemsTab";
import EcommerceTab from "./tabs/EcommerceTab";
import ApiTab from "./tabs/ApiTab";
import DocumentationTab from "./tabs/DocumentationTab";

const IntegrationsTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("systems");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="systems">Apothekensysteme</TabsTrigger>
        <TabsTrigger value="ecommerce">E-Commerce</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
        <TabsTrigger value="docs">Dokumentation</TabsTrigger>
      </TabsList>
      
      <TabsContent value="systems" className="mt-6">
        <SystemsTab />
      </TabsContent>

      <TabsContent value="ecommerce" className="mt-6">
        <EcommerceTab />
      </TabsContent>
      
      <TabsContent value="api" className="mt-6">
        <ApiTab />
      </TabsContent>
      
      <TabsContent value="docs" className="mt-6">
        <DocumentationTab />
      </TabsContent>
    </Tabs>
  );
};

export default IntegrationsTabs;
