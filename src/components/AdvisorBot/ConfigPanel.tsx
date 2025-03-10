
import React from "react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const handleTestWebhook = () => {
    // Open the webhook URL in a new tab to test it
    window.open(webhookUrl, '_blank');
  };
  
  return (
    <div className="border rounded-md p-3 bg-accent/10 text-xs">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">N8N Webhook Konfiguration</h4>
          {useN8nAgent && webhookUrl ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          )}
        </div>
        <Badge 
          variant="default" 
          className={cn(
            useN8nAgent && webhookUrl ? "bg-green-500" : "bg-yellow-500"
          )}
        >
          {useN8nAgent && webhookUrl ? 'Aktiv' : 'Inaktiv'}
        </Badge>
      </div>
      <div className="space-y-2">
        <div>
          <Input 
            type="text" 
            placeholder="N8N Webhook URL" 
            value={webhookUrl} 
            onChange={handleWebhookChange}
            className={cn(
              "text-xs h-8 mb-1",
              webhookUrl ? "border-green-500" : "border-yellow-500"
            )}
          />
          <div className="flex justify-end mt-1">
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-6 px-2" 
              onClick={handleTestWebhook}
              disabled={!webhookUrl}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Test
            </Button>
          </div>
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
        {useN8nAgent && !webhookUrl && (
          <div className="text-yellow-500 text-xs mt-1 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Bitte geben Sie eine Webhook-URL ein
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigPanel;
