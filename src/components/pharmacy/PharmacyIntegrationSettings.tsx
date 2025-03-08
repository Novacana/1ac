
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowRight, Sparkles, ExternalLink } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import IntegrationSystemsGrid from "./integrations/IntegrationSystemsGrid";
import ApiConfigurationCard from "./integrations/ApiConfigurationCard";
import DocumentationCard from "./integrations/DocumentationCard";

// Definition of available integration systems
const integrationSystems = [
  {
    id: "aposoft",
    name: "ApoSoft",
    description: "Verbinden Sie Ihre ApoSoft-Warenwirtschaft mit unserem Shop.",
    logo: "/placeholder.svg",
    connected: true,
  },
  {
    id: "awinta",
    name: "Awinta",
    description: "Integration mit Awinta-Apothekensoftware für automatische Bestandsführung.",
    logo: "/placeholder.svg",
    connected: false,
  },
  {
    id: "lauer-fischer",
    name: "Lauer-Fischer",
    description: "Synchronisieren Sie Produkte und Bestände mit Lauer-Fischer WINAPO.",
    logo: "/placeholder.svg",
    connected: false,
  },
  {
    id: "pharmatechnik",
    name: "Pharmatechnik",
    description: "Verbinden Sie XTCommerce mit Pharmatechnik IXOS.",
    logo: "/placeholder.svg",
    connected: true,
  },
];

// Definition of available e-commerce systems
const ecommerceSystems = [
  {
    id: "woocommerce",
    name: "WooCommerce",
    description: "Verbinden Sie Ihren WooCommerce-Shop mit der Apotheke.",
    logo: "/placeholder.svg",
    connected: true,
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Integration mit Shopify für Produkt- und Bestellsynchronisierung.",
    logo: "/placeholder.svg",
    connected: false,
  },
  {
    id: "magento",
    name: "Magento",
    description: "Verbinden Sie Ihren Magento-Shop mit der Apotheke.",
    logo: "/placeholder.svg",
    connected: false,
  },
  {
    id: "prestashop",
    name: "PrestaShop",
    description: "Integration mit PrestaShop für Produkt- und Bestandsverwaltung.",
    logo: "/placeholder.svg",
    connected: false,
  },
];

const PharmacyIntegrationSettings: React.FC = () => {
  const [pharmacySystems, setPharmacySystems] = useState(integrationSystems);
  const [ecomSystems, setEcomSystems] = useState(ecommerceSystems);
  const [activeTab, setActiveTab] = useState("systems");
  const navigate = useNavigate();
  
  // Add state for API configuration
  const [apiKey, setApiKey] = useState("sk_live_pharmacy_3847583745734857");
  const [webhookUrl, setWebhookUrl] = useState("https://example.com/webhook");
  const [apiEnabled, setApiEnabled] = useState(true);

  // Handle toggling connection status for integration systems
  const handleTogglePharmacyConnection = (systemId: string) => {
    const updatedSystems = pharmacySystems.map((system) => {
      if (system.id === systemId) {
        const newConnectedState = !system.connected;
        
        toast[newConnectedState ? "success" : "info"](
          newConnectedState
            ? `Verbindung zu ${system.name} wurde hergestellt`
            : `Verbindung zu ${system.name} wurde getrennt`
        );
        
        return { ...system, connected: newConnectedState };
      }
      return system;
    });
    
    setPharmacySystems(updatedSystems);
  };

  // Handle toggling connection status for e-commerce systems
  const handleToggleEcomConnection = (systemId: string) => {
    // For WooCommerce and Shopify, redirect to the config page
    if (systemId === "woocommerce" || systemId === "shopify") {
      navigate("/admin/config");
      return;
    }

    const updatedSystems = ecomSystems.map((system) => {
      if (system.id === systemId) {
        const newConnectedState = !system.connected;
        
        toast[newConnectedState ? "success" : "info"](
          newConnectedState
            ? `Verbindung zu ${system.name} wurde hergestellt`
            : `Verbindung zu ${system.name} wurde getrennt`
        );
        
        return { ...system, connected: newConnectedState };
      }
      return system;
    });
    
    setEcomSystems(updatedSystems);
  };

  // Get count of connected systems
  const connectedPharmacyCount = pharmacySystems.filter(system => system.connected).length;
  const connectedEcomCount = ecomSystems.filter(system => system.connected).length;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="systems">Apothekensysteme</TabsTrigger>
          <TabsTrigger value="ecommerce">E-Commerce</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="docs">Dokumentation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="systems" className="mt-6">
          <div className="mb-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      Apothekensysteme
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {connectedPharmacyCount > 0 
                        ? `${connectedPharmacyCount} Apothekensystem${connectedPharmacyCount > 1 ? 'e' : ''} verbunden` 
                        : 'Keine Systeme verbunden'
                      }
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => toast.info("Willkommen beim Integrationsassistenten!")}
                  >
                    Integrationsassistent
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <IntegrationSystemsGrid 
            systems={pharmacySystems} 
            onToggleConnection={handleTogglePharmacyConnection}
          />
        </TabsContent>

        <TabsContent value="ecommerce" className="mt-6">
          <div className="mb-6">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      E-Commerce Systeme
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {connectedEcomCount > 0 
                        ? `${connectedEcomCount} E-Commerce System${connectedEcomCount > 1 ? 'e' : ''} verbunden` 
                        : 'Keine Systeme verbunden'
                      }
                    </p>
                  </div>
                  <Link to="/admin/config">
                    <Button 
                      size="sm" 
                      className="flex items-center gap-2"
                    >
                      Konfiguration öffnen
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <IntegrationSystemsGrid 
            systems={ecomSystems} 
            onToggleConnection={handleToggleEcomConnection}
          />
        </TabsContent>
        
        <TabsContent value="api" className="mt-6">
          <ApiConfigurationCard 
            apiKey={apiKey}
            setApiKey={setApiKey}
            webhookUrl={webhookUrl}
            setWebhookUrl={setWebhookUrl}
            apiEnabled={apiEnabled}
            setApiEnabled={setApiEnabled}
          />
        </TabsContent>
        
        <TabsContent value="docs" className="mt-6">
          <DocumentationCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PharmacyIntegrationSettings;
