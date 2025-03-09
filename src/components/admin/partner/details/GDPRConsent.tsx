
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

interface GDPRConsentProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const GDPRConsent: React.FC<GDPRConsentProps> = ({ checked, onCheckedChange }) => {
  return (
    <Alert className="bg-blue-50 border-blue-200 my-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-blue-600 mt-0.5" />
        <div className="space-y-2">
          <AlertDescription className="text-blue-800">
            Bitte stellen Sie sicher, dass Ihre Nutzung der Partnerdaten im Einklang mit der 
            Datenschutz-Grundverordnung (DSGVO) steht. Die Verarbeitung personenbezogener Daten 
            unterliegt den Regelungen der DSGVO.
          </AlertDescription>
          
          <div className="flex items-start space-x-2 mt-3">
            <Checkbox 
              id="gdpr-consent" 
              checked={checked} 
              onCheckedChange={onCheckedChange} 
              className="mt-1"
            />
            <Label htmlFor="gdpr-consent" className="text-sm font-normal text-blue-800">
              Ich bestätige, dass ich die Partnerinformationen gemäß den Bestimmungen der DSGVO 
              verarbeite und über eine rechtmäßige Grundlage für die Verarbeitung verfüge.
            </Label>
          </div>
        </div>
      </div>
    </Alert>
  );
};

export default GDPRConsent;
