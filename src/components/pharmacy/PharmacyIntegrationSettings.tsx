
import React, { useState } from "react";
import { toast } from "sonner";
import IntegrationSystemsGrid from "./integrations/IntegrationSystemsGrid";
import ApiConfigurationCard from "./integrations/ApiConfigurationCard";
import DocumentationCard from "./integrations/DocumentationCard";
import { IntegrationSystem } from "./integrations/IntegrationSystemCard";

const PharmacyIntegrationSettings: React.FC = () => {
  const [systems, setSystems] = useState<IntegrationSystem[]>([
    {
      id: "aposoft",
      name: "APOSOFT",
      description: "Verbinden Sie Ihr APOSOFT-System für automatischen Produktimport und Bestandssynchronisation.",
      logo: "/placeholder.svg",
      connected: false
    },
    {
      id: "lauer-fischer",
      name: "Lauer-Fischer WINAPO",
      description: "Verbinden Sie Ihr WINAPO-System für automatischen Produktimport und Bestandssynchronisation.",
      logo: "/placeholder.svg",
      connected: true
    },
    {
      id: "awinta",
      name: "Awinta PROKAS",
      description: "Verbinden Sie Ihr PROKAS-System für automatischen Produktimport und Bestandssynchronisation.",
      logo: "/placeholder.svg",
      connected: false
    },
    {
      id: "pharmatechnik",
      name: "PHARMATECHNIK IXOS",
      description: "Verbinden Sie Ihr IXOS-System für automatischen Produktimport und Bestandssynchronisation.",
      logo: "/placeholder.svg",
      connected: false
    }
  ]);
  
  const [apiKey, setApiKey] = useState("sk_live_pharmacy_2938749823742983749");
  const [webhookUrl, setWebhookUrl] = useState("https://example.com/webhook/pharmacy");
  const [apiEnabled, setApiEnabled] = useState(true);

  const toggleConnection = (systemId: string) => {
    setSystems(prevSystems => prevSystems.map(system => {
      if (system.id === systemId) {
        const newConnected = !system.connected;
        
        // Show toast notification
        if (newConnected) {
          toast.success(`${system.name} wurde erfolgreich verbunden`);
        } else {
          toast.info(`Verbindung zu ${system.name} wurde getrennt`);
        }
        
        return { ...system, connected: newConnected };
      }
      return system;
    }));
  };

  return (
    <div className="space-y-6">
      <IntegrationSystemsGrid 
        systems={systems}
        onToggleConnection={toggleConnection}
      />

      <ApiConfigurationCard
        apiKey={apiKey}
        setApiKey={setApiKey}
        webhookUrl={webhookUrl}
        setWebhookUrl={setWebhookUrl}
        apiEnabled={apiEnabled}
        setApiEnabled={setApiEnabled}
      />

      <DocumentationCard />
    </div>
  );
};

export default PharmacyIntegrationSettings;
