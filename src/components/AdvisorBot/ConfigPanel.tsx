
import React from "react";
import { Input } from "@/components/ui/input";

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
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  
  return (
    <div className="border rounded-md p-3 bg-accent/10 text-xs">
      <h4 className="font-medium mb-2">N8N Webhook Konfiguration</h4>
      <div className="space-y-2">
        <div>
          <Input 
            type="text" 
            placeholder="N8N Webhook URL" 
            value={webhookUrl} 
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="text-xs h-8 mb-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="useN8nAgent" 
            checked={useN8nAgent} 
            onChange={(e) => setUseN8nAgent(e.target.checked)}
          />
          <label htmlFor="useN8nAgent" className="text-xs">N8N Agent aktivieren</label>
        </div>
      </div>
    </div>
  );
}

export default ConfigPanel;
