
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Sparkles } from "lucide-react";
import { toast } from "sonner";
import IntegrationSystemsGrid from "../IntegrationSystemsGrid";
import { IntegrationSystem } from "../IntegrationSystemCard";

// Definition of available integration systems
const initialIntegrationSystems: IntegrationSystem[] = [
  {
    id: "aposoft",
    name: "ApoSoft",
    description: "Verbinden Sie Ihre ApoSoft-Warenwirtschaft mit unserem Shop.",
    logo: "/logos/aposoft-logo.svg",
    connected: true,
  },
  {
    id: "awinta",
    name: "Awinta",
    description: "Integration mit Awinta-Apothekensoftware für automatische Bestandsführung.",
    logo: "/logos/awinta-logo.svg",
    connected: false,
  },
  {
    id: "lauer-fischer",
    name: "Lauer-Fischer",
    description: "Synchronisieren Sie Produkte und Bestände mit Lauer-Fischer WINAPO.",
    logo: "/logos/lauer-fischer-logo.svg",
    connected: false,
  },
  {
    id: "pharmatechnik",
    name: "Pharmatechnik",
    description: "Verbinden Sie XTCommerce mit Pharmatechnik IXOS.",
    logo: "/logos/pharmatechnik-logo.svg",
    connected: true,
  },
];

const SystemsTab: React.FC = () => {
  const [pharmacySystems, setPharmacySystems] = useState(initialIntegrationSystems);
  
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

  // Get count of connected systems
  const connectedPharmacyCount = pharmacySystems.filter(system => system.connected).length;

  return (
    <>
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
    </>
  );
};

export default SystemsTab;
