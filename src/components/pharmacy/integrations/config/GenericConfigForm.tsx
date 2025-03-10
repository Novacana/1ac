
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface GenericConfigProps {
  apiKey: string;
  setApiKey: (value: string) => void;
  webhookUrl: string;
  setWebhookUrl: (value: string) => void;
}

const GenericConfigForm: React.FC<GenericConfigProps> = ({
  apiKey,
  setApiKey,
  webhookUrl,
  setWebhookUrl,
}) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="api-key" className="text-right">
          API-Schlüssel
        </Label>
        <Input
          id="api-key"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="sk_live_xxxxx"
          className="col-span-3 rounded-lg"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="webhook" className="text-right">
          Webhook URL
        </Label>
        <Input
          id="webhook"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://example.com/webhook"
          className="col-span-3 rounded-lg"
        />
      </div>
    </>
  );
};

export default GenericConfigForm;
