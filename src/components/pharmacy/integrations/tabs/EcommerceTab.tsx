
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import IntegrationSystemsGrid from "../IntegrationSystemsGrid";
import { IntegrationSystem } from "../IntegrationSystemCard";

// Definition of available e-commerce systems
const initialEcommerceSystems: IntegrationSystem[] = [
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

const EcommerceTab: React.FC = () => {
  const [ecomSystems, setEcomSystems] = useState(initialEcommerceSystems);
  const navigate = useNavigate();
  
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
    </>
  );
};

export default EcommerceTab;
