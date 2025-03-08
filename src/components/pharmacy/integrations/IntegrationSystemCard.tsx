
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CheckCircle, Settings } from "lucide-react";
import { toast } from "sonner";

export interface IntegrationSystem {
  id: string;
  name: string;
  description: string;
  logo: string;
  connected: boolean;
}

interface IntegrationSystemCardProps {
  system: IntegrationSystem;
  onToggleConnection: (systemId: string) => void;
}

const IntegrationSystemCard: React.FC<IntegrationSystemCardProps> = ({
  system,
  onToggleConnection,
}) => {
  const handleTestConnection = (systemName: string) => {
    toast.success(`Verbindung zu ${systemName} erfolgreich getestet`);
  };

  const handleConfigure = (systemName: string) => {
    toast.info(`Konfiguration für ${systemName} wird geöffnet`);
  };

  return (
    <Card key={system.id} className={system.connected ? "border-primary/20" : ""}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>{system.name}</CardTitle>
          <CardDescription className="mt-1.5">
            {system.description}
          </CardDescription>
        </div>
        <div className="h-12 w-12 rounded overflow-hidden bg-muted flex items-center justify-center">
          <img src={system.logo} alt={system.name} className="max-h-10 max-w-10" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Switch
              id={`${system.id}-toggle`}
              checked={system.connected}
              onCheckedChange={() => onToggleConnection(system.id)}
            />
            <Label htmlFor={`${system.id}-toggle`}>
              {system.connected ? "Verbunden" : "Nicht verbunden"}
            </Label>
          </div>
          {system.connected && (
            <span className="text-xs text-green-600 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              Aktiv
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleTestConnection(system.name)}
          disabled={!system.connected}
        >
          Verbindung testen
        </Button>
        <Button 
          variant={system.connected ? "default" : "outline"} 
          size="sm"
          className="flex items-center gap-1"
          onClick={() => handleConfigure(system.name)}
        >
          <Settings className="h-3.5 w-3.5 mr-1" />
          Konfigurieren
        </Button>
      </CardFooter>
    </Card>
  );
};

export default IntegrationSystemCard;
