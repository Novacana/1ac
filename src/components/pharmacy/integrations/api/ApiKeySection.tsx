
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Key, Copy, RefreshCw } from "lucide-react";

interface ApiKeySectionProps {
  apiKey: string;
  setApiKey: (value: string) => void;
}

const ApiKeySection: React.FC<ApiKeySectionProps> = ({ apiKey, setApiKey }) => {
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

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Key className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="api-key">API-Schlüssel</Label>
      </div>
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
          <Copy className="mr-2 h-4 w-4" />
          Kopieren
        </Button>
        <Button 
          variant="outline"
          onClick={handleGenerateNewApiKey}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Neu generieren
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Halten Sie Ihren API-Schlüssel geheim. Dieser Schlüssel gewährt vollen Zugriff auf Ihr Konto.
      </p>
    </div>
  );
};

export default ApiKeySection;
