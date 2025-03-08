
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Webhook } from "lucide-react";

interface WebhookSectionProps {
  webhookUrl: string;
  setWebhookUrl: (value: string) => void;
}

const WebhookSection: React.FC<WebhookSectionProps> = ({ webhookUrl, setWebhookUrl }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Webhook className="h-4 w-4 text-muted-foreground" />
        <Label htmlFor="webhook-url">Webhook URL</Label>
      </div>
      <Input 
        id="webhook-url" 
        value={webhookUrl}
        onChange={(e) => setWebhookUrl(e.target.value)}
        placeholder="https://example.com/webhook"
      />
      <p className="text-xs text-muted-foreground mt-1">
        Geben Sie eine URL an, an die wir Benachrichtigungen senden können, wenn Ereignisse eintreten.
      </p>
    </div>
  );
};

export default WebhookSection;
