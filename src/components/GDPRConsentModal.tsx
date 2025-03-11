
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface GDPRConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConsent: (consent: boolean) => void;
}

const GDPRConsentModal: React.FC<GDPRConsentModalProps> = ({
  isOpen,
  onClose,
  onConsent,
}) => {
  const [hasConsented, setHasConsented] = useState(false);

  const handleConsent = () => {
    onConsent(true);
    setHasConsented(true);
    onClose();
  };

  const handleDecline = () => {
    onConsent(false);
    setHasConsented(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Datenschutzhinweis</DialogTitle>
          <DialogDescription>
            Wir benötigen Ihre Zustimmung, bevor Sie den Chat nutzen können.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Gemäß der Datenschutz-Grundverordnung (DSGVO) und dem Health Insurance Portability and Accountability Act (HIPAA) benötigen wir Ihre Einwilligung.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <p className="text-sm">
              Durch die Nutzung unseres Chatbots stimmen Sie zu, dass:
            </p>
            <ul className="list-disc pl-5 text-sm space-y-2">
              <li>Ihre Chateingaben an unseren Server gesendet werden, um Antworten zu generieren</li>
              <li>Wir verwenden den FHIR-Standard (Fast Healthcare Interoperability Resources) zur sicheren Übertragung von Gesundheitsdaten</li>
              <li>Alle Daten werden gemäß DSGVO und HIPAA-Standards verarbeitet</li>
              <li>Ihre Daten werden nur für den Zweck der Beantwortung Ihrer Anfragen verwendet</li>
            </ul>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="gdpr-consent" 
                checked={hasConsented} 
                onCheckedChange={(checked) => setHasConsented(checked as boolean)}
              />
              <label htmlFor="gdpr-consent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Ich stimme der Verarbeitung meiner Daten gemäß den oben genannten Bedingungen zu
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2 sm:justify-between">
          <Button variant="outline" onClick={handleDecline}>
            Ablehnen
          </Button>
          <Button onClick={handleConsent} disabled={!hasConsented}>
            Zustimmen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GDPRConsentModal;
