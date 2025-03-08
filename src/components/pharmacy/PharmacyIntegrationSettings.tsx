
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, CheckCircle, Settings, Database, Globe, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface IntegrationSystem {
  id: string;
  name: string;
  description: string;
  logo: string;
  connected: boolean;
}

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

  const handleTestConnection = (systemName: string) => {
    toast.success(`Verbindung zu ${systemName} erfolgreich getestet`);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {systems.map((system) => (
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
                    onCheckedChange={() => toggleConnection(system.id)}
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
              >
                <Settings className="h-3.5 w-3.5 mr-1" />
                Konfigurieren
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>API-Konfiguration</CardTitle>
          <CardDescription>
            Verwenden Sie diese Einstellungen für benutzerdefinierte Integrationen.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">API-Schlüssel</Label>
            <div className="flex gap-2">
              <Input id="api-key" type="password" value="sk_live_pharmacy_2938749823742983749" readOnly />
              <Button variant="outline">Kopieren</Button>
              <Button variant="outline">Neu generieren</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Halten Sie Ihren API-Schlüssel geheim. Dieser Schlüssel gewährt vollen Zugriff auf Ihr Konto.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input id="webhook-url" value="https://example.com/webhook/pharmacy" />
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <Switch id="enable-api" defaultChecked />
            <Label htmlFor="enable-api">API aktivieren</Label>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button>Änderungen speichern</Button>
        </CardFooter>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Dokumentation & Hilfe</CardTitle>
          <CardDescription>
            Ressourcen zur Unterstützung bei der Integration Ihrer Apothekensoftware
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" className="justify-start h-auto py-4 px-4">
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center mb-1">
                  <Database className="h-4 w-4 mr-2" />
                  <span className="font-medium">API Dokumentation</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Technische Details zur API-Integration
                </span>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
            
            <Button variant="outline" className="justify-start h-auto py-4 px-4">
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center mb-1">
                  <Globe className="h-4 w-4 mr-2" />
                  <span className="font-medium">Entwickler-Portal</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Tools und Ressourcen für Entwickler
                </span>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
            
            <Button variant="outline" className="justify-start h-auto py-4 px-4">
              <div className="flex flex-col items-start text-left">
                <div className="flex items-center mb-1">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  <span className="font-medium">Support kontaktieren</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Hilfe bei Integrationsproblemen
                </span>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PharmacyIntegrationSettings;
