
import React, { useState } from "react";
import ApiConfigurationCard from "../ApiConfigurationCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const ApiTab: React.FC = () => {
  // Add state for API configuration
  const [apiKey, setApiKey] = useState("sk_live_pharmacy_3847583745734857");
  const [webhookUrl, setWebhookUrl] = useState("https://example.com/webhook");
  const [apiEnabled, setApiEnabled] = useState(true);

  return (
    <div className="space-y-6">
      <Alert variant="warning" className="mb-6">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Die API-Verwendung unterliegt der Datenschutz-Grundverordnung (DSGVO). Stellen Sie sicher, dass Ihre Integration die Datenschutzanforderungen erfüllt.
        </AlertDescription>
      </Alert>
      
      <ApiConfigurationCard 
        apiKey={apiKey}
        setApiKey={setApiKey}
        webhookUrl={webhookUrl}
        setWebhookUrl={setWebhookUrl}
        apiEnabled={apiEnabled}
        setApiEnabled={setApiEnabled}
      />
      
      <Card>
        <CardHeader>
          <CardTitle>Nutzungslimits</CardTitle>
          <CardDescription>
            Informationen zu Ihren aktuellen API-Nutzungslimits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Anfragen pro Minute:</span>
              <span>60/100</span>
            </div>
            <div className="flex justify-between">
              <span>Tägliche Anfragelimits:</span>
              <span>2,450/10,000</span>
            </div>
            <div className="flex justify-between">
              <span>Monatliche Anfragen:</span>
              <span>45,320/300,000</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTab;
