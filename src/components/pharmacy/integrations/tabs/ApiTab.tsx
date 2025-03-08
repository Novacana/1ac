
import React, { useState } from "react";
import ApiConfigurationCard from "../ApiConfigurationCard";

const ApiTab: React.FC = () => {
  // Add state for API configuration
  const [apiKey, setApiKey] = useState("sk_live_pharmacy_3847583745734857");
  const [webhookUrl, setWebhookUrl] = useState("https://example.com/webhook");
  const [apiEnabled, setApiEnabled] = useState(true);

  return (
    <ApiConfigurationCard 
      apiKey={apiKey}
      setApiKey={setApiKey}
      webhookUrl={webhookUrl}
      setWebhookUrl={setWebhookUrl}
      apiEnabled={apiEnabled}
      setApiEnabled={setApiEnabled}
    />
  );
};

export default ApiTab;
