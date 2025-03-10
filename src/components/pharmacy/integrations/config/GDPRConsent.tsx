
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

interface GDPRConsentProps {
  dataProcessingConsent: boolean;
  setDataProcessingConsent: (value: boolean) => void;
  privacyNotice: string;
}

const GDPRConsent: React.FC<GDPRConsentProps> = ({
  dataProcessingConsent,
  setDataProcessingConsent,
  privacyNotice,
}) => {
  return (
    <>
      <Alert className="mt-2 bg-primary/5 border-primary/20 rounded-lg">
        <ShieldCheck className="h-4 w-4 text-primary" />
        <AlertDescription className="text-xs">
          {privacyNotice}
        </AlertDescription>
      </Alert>
      
      <div className="flex items-center space-x-2 mt-2">
        <Switch
          id="gdpr-consent"
          checked={dataProcessingConsent}
          onCheckedChange={setDataProcessingConsent}
          className="data-[state=checked]:bg-green-500"
        />
        <Label htmlFor="gdpr-consent" className="text-sm">
          Ich stimme der Verarbeitung der Daten gemäß der Datenschutzrichtlinie zu
        </Label>
      </div>
    </>
  );
};

export default GDPRConsent;
