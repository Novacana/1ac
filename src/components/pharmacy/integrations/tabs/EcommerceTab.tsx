
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Sparkles, ShoppingCart, Globe } from "lucide-react";
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
  {
    id: "woocommerce",
    name: "WooCommerce",
    description: "Verbinden Sie Ihren WooCommerce-Shop mit unserer Plattform.",
    logo: "/placeholder.svg",
    connected: false,
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Verbinden Sie Ihren Shopify-Shop mit unserer Plattform.",
    logo: "/placeholder.svg",
    connected: false,
  }
];

const EcommerceTab: React.FC = () => {
  const [ecomSystems, setEcomSystems] = useState(initialEcommerceSystems);
  const navigate = useNavigate();
  
  // Handle toggling connection status for e-commerce systems
  const handleToggleEcomConnection = (systemId: string) => {
    const updatedSystems = ecomSystems.map((system) => {
      if (system.id === systemId) {
        const newConnectedState = !system.connected;
        
        // Zeigen Sie unterschiedliche Nachrichten basierend auf dem System an
        let message = "";
        if (system.id === "woocommerce") {
          message = newConnectedState 
            ? "WooCommerce-Verbindung wurde hergestellt. Sie können nun Ihre WooCommerce-Produkte verwalten."
            : "WooCommerce-Verbindung wurde getrennt. Produkte werden nicht mehr synchronisiert.";
        } else if (system.id === "shopify") {
          message = newConnectedState 
            ? "Shopify-Verbindung wurde hergestellt. Sie können nun Ihre Shopify-Produkte verwalten."
            : "Shopify-Verbindung wurde getrennt. Produkte werden nicht mehr synchronisiert.";
        } else {
          message = newConnectedState
            ? `Verbindung zu ${system.name} wurde hergestellt`
            : `Verbindung zu ${system.name} wurde getrennt`;
        }
        
        toast[newConnectedState ? "success" : "info"](message);
        
        return { ...system, connected: newConnectedState };
      }
      return system;
    });
    
    setEcomSystems(updatedSystems);
  };

  // Navigate to admin config
  const handleNavigateToConfig = () => {
    navigate("/admin/config");
    toast.info("Konfigurationsbereich geöffnet");
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
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Shop-Integrationen
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {connectedEcomCount > 0 
                    ? `${connectedEcomCount} System${connectedEcomCount > 1 ? 'e' : ''} verbunden` 
                    : 'Keine Systeme verbunden'
                  }
                </p>
              </div>
              <Button 
                size="sm" 
                className="flex items-center gap-2"
                onClick={handleNavigateToConfig}
              >
                Konfiguration öffnen
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          E-Commerce-Plattformen
        </h4>
        <p className="text-sm text-muted-foreground mb-4">
          Verbinden Sie Ihre externen Online-Shops, um Produkte zu synchronisieren.
          Hinweis: Jede Apotheke kann nur ihre eigenen Produkte verwalten und einsehen.
        </p>
      </div>
      
      <IntegrationSystemsGrid 
        systems={ecomSystems} 
        onToggleConnection={handleToggleEcomConnection}
      />
    </>
  );
};

export default EcommerceTab;
