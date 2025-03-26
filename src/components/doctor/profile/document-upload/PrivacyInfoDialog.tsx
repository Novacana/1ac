
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PrivacyInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PrivacyInfoDialog: React.FC<PrivacyInfoDialogProps> = ({
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Datenschutz- und Compliance-Informationen</DialogTitle>
          <DialogDescription>
            Detaillierte Informationen zur Verarbeitung Ihrer medizinischen Dokumente
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
          <h4 className="font-medium">DSGVO-Konformität</h4>
          <p className="text-sm text-muted-foreground">
            Die Verarbeitung Ihrer Dokumente erfolgt in Übereinstimmung mit der Datenschutz-Grundverordnung (DSGVO):
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
            <li>Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)</li>
            <li>Datenminimierung: Wir erheben nur die für die Überprüfung notwendigen Daten</li>
            <li>Speicherbegrenzung: Dokumente werden nur für den erforderlichen Zeitraum gespeichert</li>
            <li>Technische Sicherheitsmaßnahmen: Verschlüsselung und Zugriffskontrollen</li>
          </ul>
          
          <h4 className="font-medium">HIPAA-Konformität</h4>
          <p className="text-sm text-muted-foreground">
            Als medizinische Plattform erfüllen wir die Anforderungen des Health Insurance Portability and Accountability Act (HIPAA):
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
            <li>Privacy Rule: Schutz persönlicher Gesundheitsinformationen (PHI)</li>
            <li>Security Rule: Implementierung technischer und organisatorischer Schutzmaßnahmen</li>
            <li>Breach Notification: Protokollierung und Meldung von Datenschutzverletzungen</li>
          </ul>
          
          <h4 className="font-medium">FHIR-Standard Implementierung</h4>
          <p className="text-sm text-muted-foreground">
            Fast Healthcare Interoperability Resources (FHIR) wird für die strukturierte Speicherung verwendet:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
            <li>DocumentReference-Ressource für alle hochgeladenen Dokumente</li>
            <li>Standardisierte Metadaten gemäß HL7 FHIR R4</li>
            <li>Erweiterte Sicherheitsmerkmale gemäß SMART on FHIR</li>
          </ul>
          
          <h4 className="font-medium">Ihre Rechte</h4>
          <p className="text-sm text-muted-foreground">
            Sie haben folgende Rechte bezüglich Ihrer Daten:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
            <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
            <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
            <li>Recht auf Löschung (Art. 17 DSGVO)</li>
            <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
            <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
            <li>Recht auf Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO)</li>
          </ul>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            Schließen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyInfoDialog;
