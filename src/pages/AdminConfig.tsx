
import React, { useState } from "react";
import Layout from "@/components/Layout";
import PartnerConfig from "@/components/admin/PartnerConfig";
import PaymentConfig from "@/components/admin/PaymentConfig";
import CentralAdminConfig from "@/components/admin/CentralAdminConfig";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdminConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState("partners");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zum Shop
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Shop-Konfiguration</h1>
            <p className="text-muted-foreground mt-2">
              Konfigurieren Sie Ihre Shop-Integrationen, Partner und Zahlungseinstellungen.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="central">Zentrale Verwaltung</TabsTrigger>
              <TabsTrigger value="partners">Partner</TabsTrigger>
              <TabsTrigger value="payments">Zahlungen</TabsTrigger>
            </TabsList>
            
            <TabsContent value="central">
              <CentralAdminConfig />
            </TabsContent>

            <TabsContent value="partners">
              <PartnerConfig />
            </TabsContent>

            <TabsContent value="payments">
              <PaymentConfig />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminConfig;
