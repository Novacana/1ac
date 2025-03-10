
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ConfigPanelProps {
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  useN8nAgent: boolean;
  setUseN8nAgent: (use: boolean) => void;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({
  webhookUrl,
  setWebhookUrl,
  useN8nAgent,
  setUseN8nAgent
}) => {
  // Always show in development or if URL parameters contain 'showConfig=true'
  const shouldShowConfig = process.env.NODE_ENV === 'development' || 
                          window.location.search.includes('showConfig=true');
  
  if (!shouldShowConfig) {
    return null;
  }
  
  const handleWebhookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setWebhookUrl(newUrl);
    localStorage.setItem('n8nWebhookUrl', JSON.stringify(newUrl));
    console.log("Webhook URL updated:", newUrl);
  };
  
  const handleAgentToggle = (checked: boolean) => {
    console.log("Toggling n8n agent:", checked);
    setUseN8nAgent(checked);
    localStorage.setItem('useN8nAgent', JSON.stringify(checked));
  };
  
  return (
    <div className="border rounded-md p-3 bg-accent/10 text-xs">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">N8N Webhook Konfiguration</h4>
        <Badge variant={useN8nAgent ? "success" : "secondary"} className={useN8nAgent ? "bg-green-500" : ""}>
          {useN8nAgent ? 'Aktiv' : 'Inaktiv'}
        </Badge>
      </div>
      <div className="space-y-2">
        <div>
          <Input 
            type="text" 
            placeholder="N8N Webhook URL" 
            value={webhookUrl} 
            onChange={handleWebhookChange}
            className="text-xs h-8 mb-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch 
            id="useN8nAgent" 
            checked={useN8nAgent} 
            onCheckedChange={handleAgentToggle}
            className="data-[state=checked]:bg-green-500"
          />
          <Label htmlFor="useN8nAgent" className="text-xs">
            N8N Agent {useN8nAgent ? '(aktiv)' : '(inaktiv)'}
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
