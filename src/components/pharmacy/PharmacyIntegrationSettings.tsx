
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowRight, Sparkles } from "lucide-react";
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

const PharmacyIntegrationSettings: React.FC = () => {
  const [systems, setSystems] = useState(integrationSystems);
  const [activeTab, setActiveTab] = useState("systems");

  // Handle toggling connection status for integration systems
  const handleToggleConnection = (systemId: string) => {
    const updatedSystems = systems.map((system) => {
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
    
    setSystems(updatedSystems);
  };

  // Get count of connected systems
  const connectedCount = systems.filter(system => system.connected).length;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="systems">Systeme</TabsTrigger>
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
                      Integrationsübersicht
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {connectedCount > 0 
                        ? `${connectedCount} Integrationssystem${connectedCount > 1 ? 'e' : ''} verbunden` 
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
            systems={systems} 
            onToggleConnection={handleToggleConnection}
          />
        </TabsContent>
        
        <TabsContent value="api" className="mt-6">
          <ApiConfigurationCard />
        </TabsContent>
        
        <TabsContent value="docs" className="mt-6">
          <DocumentationCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PharmacyIntegrationSettings;
