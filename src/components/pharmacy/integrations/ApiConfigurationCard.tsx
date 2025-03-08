
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ApiKeySection from "./api/ApiKeySection";
import WebhookSection from "./api/WebhookSection";
import ApiToggleSection from "./api/ApiToggleSection";

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
        <ApiKeySection apiKey={apiKey} setApiKey={setApiKey} />
        <WebhookSection webhookUrl={webhookUrl} setWebhookUrl={setWebhookUrl} />
        <ApiToggleSection apiEnabled={apiEnabled} setApiEnabled={setApiEnabled} />
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button onClick={handleSaveChanges}>Änderungen speichern</Button>
      </CardFooter>
    </Card>
  );
};

export default ApiConfigurationCard;
