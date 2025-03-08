
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Upload, Download, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import PharmacyProductsList from "@/components/pharmacy/PharmacyProductsList";
import PharmacyIntegrationSettings from "@/components/pharmacy/PharmacyIntegrationSettings";
import { useAuth } from "@/contexts/AuthContext";

const PharmacyManagement: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("products");

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return navigate("/login");
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <Link to="/">
                <Button variant="outline" size="sm" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Zurück zum Shop
                </Button>
              </Link>
              <h1 className="text-3xl font-bold">Apotheken-Management</h1>
              <p className="text-muted-foreground mt-2">
                Verwalten Sie Ihre Produkte und Integrationen für Ihre Apotheke
              </p>
            </div>
            
            <div className="flex gap-2 mt-4 md:mt-0">
              <Button variant="outline" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Importieren
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Exportieren
              </Button>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Neues Produkt
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-flex">
              <TabsTrigger value="products">Produkte</TabsTrigger>
              <TabsTrigger value="integrations">Integrationen</TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="products">
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
              </TabsContent>
              
              <TabsContent value="integrations">
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
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default PharmacyManagement;
