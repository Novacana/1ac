
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldCheck } from "lucide-react";

const PharmacyDispenseItem: React.FC = () => {
  return (
    <AccordionItem value="item-3">
      <AccordionTrigger>Apotheken-Anbindung</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <h3 className="font-medium">Rezeptübermittlung an Apotheken</h3>
        <p>
          Nach Erstellung eines Rezepts können Sie es direkt an die zuständige Apotheke 
          übermitteln. Das System wählt automatisch die Apotheke basierend auf den 
          Produkten im Warenkorb des Patienten aus.
        </p>
        <h3 className="font-medium mt-4">GDPR & HIPAA Compliance</h3>
        <p>
          Alle Rezeptübermittlungen erfolgen im FHIR-Format (MedicationDispense) und sind 
          sowohl GDPR- als auch HIPAA-konform. Jede Übermittlung wird für Auditzwecke 
          protokolliert.
        </p>
        <Alert className="mt-4 bg-blue-50 border-blue-200">
          <ShieldCheck className="h-4 w-4 text-blue-500" />
          <AlertTitle className="text-blue-700">Datenschutzhinweis</AlertTitle>
          <AlertDescription className="text-blue-600">
            Die Übermittlung von Rezepten an Apotheken erfolgt unter strikter Einhaltung 
            der EU-Datenschutzgrundverordnung (DSGVO) und des Health Insurance Portability 
            and Accountability Act (HIPAA). Alle übermittelten Daten werden verschlüsselt 
            und nur für den vorgesehenen Zweck verwendet.
          </AlertDescription>
        </Alert>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PharmacyDispenseItem;
