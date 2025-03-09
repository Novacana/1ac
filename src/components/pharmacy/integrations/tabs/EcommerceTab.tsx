
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import IntegrationSystemsGrid from "../IntegrationSystemsGrid";
import { IntegrationSystem } from "../IntegrationSystemCard";

// Definition of available e-commerce systems for partners
const initialEcommerceSystems: IntegrationSystem[] = [
  {
    id: "partner-api",
    name: "Partner API",
    description: "Direkte Anbindung der Partner-Inventarsysteme an unsere Plattform.",
    logo: "/placeholder.svg",
    connected: true,
  },
  {
    id: "csv-import",
    name: "CSV-Import",
    description: "Import von Produkten per CSV-Datei für Partner ohne API-Anbindung.",
    logo: "/placeholder.svg",
    connected: false,
  },
  {
    id: "manual-entry",
    name: "Manuelle Eingabe",
    description: "Partner können Produkte manuell in unserem System anlegen.",
    logo: "/placeholder.svg",
    connected: true,
  },
  {
    id: "inventory-sync",
    name: "Bestandssynchronisierung",
    description: "Automatische Bestandssynchronisierung zwischen Partnern und Plattform.",
    logo: "/placeholder.svg",
    connected: false,
  },
];

const EcommerceTab: React.FC = () => {
  const [ecomSystems, setEcomSystems] = useState(initialEcommerceSystems);
  const navigate = useNavigate();
  
  // Handle toggling connection status for e-commerce systems
  const handleToggleEcomConnection = (systemId: string) => {
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
  const connectedEcomCount = ecomSystems.filter(system => system.connected).length;

  return (
    <>
      <div className="mb-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Partner-Produkt Systeme
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {connectedEcomCount > 0 
                    ? `${connectedEcomCount} System${connectedEcomCount > 1 ? 'e' : ''} verbunden` 
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
    </>
  );
};

export default EcommerceTab;
