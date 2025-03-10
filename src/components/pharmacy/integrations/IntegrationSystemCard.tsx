
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import SystemConfigModal from "./SystemConfigModal";
import GDPRConsentModal from "./GDPRConsentModal";

export interface IntegrationSystem {
  id: string;
  name: string;
  description: string;
  logo: string;
  connected: boolean;
}

interface IntegrationSystemCardProps {
  system: IntegrationSystem;
  onToggleConnection: (id: string) => void;
}

const IntegrationSystemCard: React.FC<IntegrationSystemCardProps> = ({ 
  system, 
  onToggleConnection 
}) => {
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  
  const handleConnectionToggle = () => {
    if (!system.connected) {
      // Wenn nicht verbunden, zeige zuerst den DSGVO-Dialog an
      setShowConsentModal(true);
    } else {
      // Wenn bereits verbunden, direkt trennen
      onToggleConnection(system.id);
    }
  };
  
  const handleConsentAccepted = () => {
    setShowConsentModal(false);
    onToggleConnection(system.id);
  };
  
  const handleConsentDeclined = () => {
    setShowConsentModal(false);
    // Tue nichts, da der Benutzer keine Verbindung herstellen möchte
  };

  return (
    <>
      <Card className="overflow-hidden border-border/40 transition-all duration-200 hover:shadow-md hover:border-primary/20 rounded-xl h-full flex flex-col">
        <CardContent className="p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-muted/50 rounded-lg p-2 w-10 h-10 flex items-center justify-center">
              <img 
                src={system.logo}
                alt={`${system.name} Logo`}
                className="w-6 h-6"
              />
            </div>
            <Switch 
              checked={system.connected} 
              onCheckedChange={handleConnectionToggle}
              className="data-[state=checked]:bg-green-500"
            />
          </div>
          
          <h3 className="font-medium mb-1">{system.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 flex-grow">{system.description}</p>
          
          <Button
            variant="outline"
            size="sm"
            className="mt-auto w-full rounded-xl hover:bg-primary/5 border-primary/20 flex items-center justify-center gap-1.5 transition-all"
            onClick={() => setShowConfigModal(true)}
          >
            <Settings className="h-4 w-4 text-primary" />
            <span>Konfigurieren</span>
          </Button>
        </CardContent>
      </Card>
      
      <SystemConfigModal 
        open={showConfigModal} 
        onOpenChange={setShowConfigModal} 
        system={system}
      />
      
      <GDPRConsentModal
        open={showConsentModal}
        onOpenChange={setShowConsentModal}
        onAccept={handleConsentAccepted}
        onDecline={handleConsentDeclined}
      />
    </>
  );
};

export default IntegrationSystemCard;
