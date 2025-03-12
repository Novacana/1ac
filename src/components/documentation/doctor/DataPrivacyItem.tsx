
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const DataPrivacyItem: React.FC = () => {
  return (
    <AccordionItem value="item-4">
      <AccordionTrigger>Datenschutz & Dokumentation</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <h3 className="font-medium">Patienteneinwilligung</h3>
        <p>
          Vor der Behandlung muss der Patient seine Einwilligung zur Datenverarbeitung geben. 
          Dies geschieht digital über die Plattform und wird dokumentiert.
        </p>
        <h3 className="font-medium mt-4">Behandlungsdokumentation</h3>
        <p>
          Jede Behandlung sollte sorgfältig dokumentiert werden. Die Plattform bietet 
          strukturierte Formulare, die die Dokumentation erleichtern.
        </p>
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>DSGVO-Hinweis</AlertTitle>
          <AlertDescription>
            Alle Patientendaten werden gemäß DSGVO verschlüsselt gespeichert. 
            Als Arzt sind Sie mitverantwortlich für den Schutz dieser Daten.
          </AlertDescription>
        </Alert>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DataPrivacyItem;
