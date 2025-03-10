
import React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

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
  // Only show in development mode
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  const handleWebhookChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWebhookUrl(e.target.value);
  };
  
  const handleAgentToggle = (checked: boolean) => {
    console.log("Toggling n8n agent:", checked);
    setUseN8nAgent(checked);
  };
  
  return (
    <div className="border rounded-md p-3 bg-accent/10 text-xs">
      <h4 className="font-medium mb-2">N8N Webhook Konfiguration</h4>
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
            N8N Agent aktivieren {useN8nAgent ? '(aktiv)' : '(inaktiv)'}
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ConfigPanel;
