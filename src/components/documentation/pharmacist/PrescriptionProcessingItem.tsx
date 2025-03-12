
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const PrescriptionProcessingItem: React.FC = () => {
  return (
    <AccordionItem value="item-4">
      <AccordionTrigger>Rezeptabwicklung</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <h3 className="font-medium">Eingegangene Rezepte</h3>
        <p>
          Unter "Rezepte" finden Sie alle elektronischen Rezepte, die für Ihre Apotheke 
          eingegangen sind. Prüfen Sie die Details und bestätigen Sie die Annahme.
        </p>
        <h3 className="font-medium mt-4">Rezepteinlösung</h3>
        <p>
          Nach Prüfung eines Rezepts können Sie es einlösen. Wählen Sie die entsprechenden 
          Produkte aus Ihrem Sortiment und bestätigen Sie die Abgabe.
        </p>
        <Alert variant="destructive" className="mt-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Rechtlicher Hinweis</AlertTitle>
          <AlertDescription>
            Stellen Sie sicher, dass die Abgabe von verschreibungspflichtigen Medikamenten 
            gemäß den geltenden gesetzlichen Bestimmungen erfolgt.
          </AlertDescription>
        </Alert>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PrescriptionProcessingItem;
