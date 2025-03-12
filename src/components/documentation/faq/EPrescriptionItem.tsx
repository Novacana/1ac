
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const EPrescriptionItem: React.FC = () => {
  return (
    <AccordionItem value="item-4">
      <AccordionTrigger>Wie funktioniert die E-Rezept-Funktion?</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <h3 className="font-medium">Für Ärzte:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Navigieren Sie zu <Link to="/doctor-dashboard" className="text-primary underline">Rezeptverwaltung</Link> in Ihrem Dashboard
          </li>
          <li>
            Klicken Sie auf <span className="font-medium">Neues Rezept</span>
          </li>
          <li>
            Wählen Sie den Patienten aus der Dropdown-Liste oder suchen Sie nach einem bestimmten Patienten
          </li>
          <li>
            Geben Sie die Medikamentendetails, Dosierung und Anwendungsdauer ein
          </li>
          <li>
            Überprüfen Sie die Eingaben und klicken Sie auf <span className="font-medium">Digital signieren</span>
          </li>
          <li>
            Bestätigen Sie die Signatur mit Ihrem Arztausweis oder der TelematikID
          </li>
        </ol>
        
        <h3 className="font-medium mt-2">Für Patienten:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Nach der Ausstellung erhalten Sie eine Benachrichtigung in Ihrem <Link to="/dashboard" className="text-primary underline">Patientenkonto</Link>
          </li>
          <li>
            Unter <span className="font-medium">Meine Rezepte</span> können Sie alle aktuellen Rezepte einsehen
          </li>
          <li>
            Klicken Sie auf <span className="font-medium">Apotheke wählen</span>, um das Rezept einer Apotheke zuzuweisen
          </li>
          <li>
            Wählen Sie eine Apotheke aus der Liste oder suchen Sie nach einer bestimmten Apotheke
          </li>
          <li>
            Bestätigen Sie Ihre Auswahl, um das Rezept der gewählten Apotheke zu übermitteln
          </li>
        </ol>
        
        <h3 className="font-medium mt-2">Für Apotheken:</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Neue Rezepte erscheinen in Ihrem <Link to="/pharmacy-management" className="text-primary underline">Apotheken-Dashboard</Link> unter <span className="font-medium">Rezepteingänge</span>
          </li>
          <li>
            Klicken Sie auf ein Rezept, um die Details einzusehen
          </li>
          <li>
            Bearbeiten Sie das Rezept durch Klick auf <span className="font-medium">Bearbeiten</span>
          </li>
          <li>
            Markieren Sie das Rezept als <span className="font-medium">In Bearbeitung</span>, <span className="font-medium">Bereit zur Abholung</span> oder <span className="font-medium">Versandt</span>
          </li>
        </ol>
        
        <Alert className="mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Alle E-Rezepte werden gemäß DSGVO und HIPAA sicher verarbeitet und entsprechen dem FHIR-Standard 
            für medizinische Datenaustausche. Die Datenübertragung erfolgt verschlüsselt.
          </AlertDescription>
        </Alert>
      </AccordionContent>
    </AccordionItem>
  );
};

export default EPrescriptionItem;
