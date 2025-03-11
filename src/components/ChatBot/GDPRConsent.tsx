
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

interface GDPRConsentProps {
  onConsent: (consent: boolean) => void;
}

const GDPRConsent: React.FC<GDPRConsentProps> = ({ onConsent }) => {
  return (
    <Card className="border-2 border-muted">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          Datenschutzhinweis
        </CardTitle>
      </CardHeader>
      <CardContent className="text-xs space-y-2">
        <p>
          Wir verwenden diesen Chat, um Ihnen bei Ihren Anfragen zu helfen. Um dies zu ermöglichen, werden Ihre Nachrichten in Übereinstimmung mit:
        </p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Der Datenschutz-Grundverordnung (DSGVO)</li>
          <li>Dem Health Insurance Portability and Accountability Act (HIPAA)</li>
          <li>Den FHIR-Kommunikationsstandards für Gesundheitsdaten</li>
        </ul>
        <p>
          verarbeitet. Ihre Daten werden verschlüsselt gespeichert und nicht für andere Zwecke verwendet.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onConsent(false)}
        >
          Ablehnen
        </Button>
        <Button 
          size="sm"
          onClick={() => onConsent(true)}
        >
          Akzeptieren
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GDPRConsent;
