
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface ApiConfigurationCardProps {
  apiKey: string;
  setApiKey: (value: string) => void;
  webhookUrl: string;
  setWebhookUrl: (value: string) => void;
  apiEnabled: boolean;
  setApiEnabled: (value: boolean) => void;
}

const ApiConfigurationCard: React.FC<ApiConfigurationCardProps> = ({
  apiKey,
  setApiKey,
  webhookUrl,
  setWebhookUrl,
  apiEnabled,
  setApiEnabled,
}) => {
  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success("API-Schlüssel in die Zwischenablage kopiert");
  };

  const handleGenerateNewApiKey = () => {
    // Normally we'd call an API here to generate a new key
    const newKey = "sk_live_pharmacy_" + Math.random().toString().substring(2, 20);
    setApiKey(newKey);
    toast.success("Neuer API-Schlüssel wurde generiert");
  };

  const handleSaveChanges = () => {
    toast.success("Änderungen wurden gespeichert");
  };

  return (
    <Card>
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
            <Input 
              id="api-key" 
              type="password" 
              value={apiKey} 
              readOnly 
            />
            <Button 
              variant="outline"
              onClick={handleCopyApiKey}
            >
              Kopieren
            </Button>
            <Button 
              variant="outline"
              onClick={handleGenerateNewApiKey}
            >
              Neu generieren
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Halten Sie Ihren API-Schlüssel geheim. Dieser Schlüssel gewährt vollen Zugriff auf Ihr Konto.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="webhook-url">Webhook URL</Label>
          <Input 
            id="webhook-url" 
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <Switch 
            id="enable-api" 
            checked={apiEnabled}
            onCheckedChange={setApiEnabled}
          />
          <Label htmlFor="enable-api">API aktivieren</Label>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button onClick={handleSaveChanges}>Änderungen speichern</Button>
      </CardFooter>
    </Card>
  );
};

export default ApiConfigurationCard;
