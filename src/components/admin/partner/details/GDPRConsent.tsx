
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

interface GDPRConsentProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const GDPRConsent: React.FC<GDPRConsentProps> = ({ checked, onCheckedChange }) => {
  return (
    <div className="border border-border rounded-md p-4 bg-muted/20">
      <div className="flex items-center space-x-2 mb-2">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h3 className="font-medium">DSGVO-Einwilligung</h3>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        Gemäß der Datenschutz-Grundverordnung (DSGVO) benötigen wir Ihre explizite Einwilligung,
        um die Daten dieses Partners zu verarbeiten. Dies umfasst personenbezogene Daten wie 
        Name, Kontaktinformationen und Geschäftsdaten.
      </p>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="gdpr-consent" 
          checked={checked} 
          onCheckedChange={onCheckedChange} 
        />
        <Label htmlFor="gdpr-consent" className="text-sm">
          Ich bestätige, dass ich die Einwilligung des Partners zur Verarbeitung seiner 
          Daten gemäß Art. 6 Abs. 1 lit. a DSGVO eingeholt habe und alle Daten DSGVO-konform 
          verarbeitet werden.
        </Label>
      </div>
    </div>
  );
};

export default GDPRConsent;
