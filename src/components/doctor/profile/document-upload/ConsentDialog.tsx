
import React from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gdprConsent: boolean;
  setGdprConsent: (checked: boolean) => void;
  onConfirm: () => void;
}

const ConsentDialog: React.FC<ConsentDialogProps> = ({
  open,
  onOpenChange,
  gdprConsent,
  setGdprConsent,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Datenschutz-Einwilligung</DialogTitle>
          <DialogDescription>
            Um Ihre Dokumente zu verarbeiten, benötigen wir Ihre Einwilligung gemäß DSGVO und HIPAA-Richtlinien.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <Alert variant="default" className="bg-primary/5 border-primary/20">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <AlertTitle>Informationen zur Datenverarbeitung</AlertTitle>
            <AlertDescription className="text-xs">
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Ihre Dokumente werden verschlüsselt auf unseren Servern gespeichert</li>
                <li>Die Verarbeitung erfolgt gemäß FHIR-Standard (HL7 DocumentReference)</li>
                <li>Nur autorisiertes Personal hat Zugriff auf Ihre Dokumente</li>
                <li>Sie können Ihre Einwilligung jederzeit widerrufen und die Löschung Ihrer Daten beantragen</li>
                <li>Die Speicherung erfolgt konform mit DSGVO und HIPAA</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <div className="flex items-start space-x-2">
            <Checkbox 
              id="gdpr-consent-checkbox" 
              checked={gdprConsent}
              onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
            />
            <Label 
              htmlFor="gdpr-consent-checkbox" 
              className="text-sm leading-normal"
            >
              Ich stimme der Verarbeitung meiner hochgeladenen Dokumente zu den oben genannten Bedingungen zu und bin damit einverstanden, dass diese Daten für die Überprüfung meiner medizinischen Qualifikationen verwendet werden.
            </Label>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Abbrechen
          </Button>
          <Button onClick={onConfirm} disabled={!gdprConsent}>
            Bestätigen und fortfahren
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentDialog;
