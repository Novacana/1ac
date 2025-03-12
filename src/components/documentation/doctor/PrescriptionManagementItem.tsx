
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const PrescriptionManagementItem: React.FC = () => {
  return (
    <AccordionItem value="item-2">
      <AccordionTrigger>Rezeptverwaltung</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <h3 className="font-medium">Rezeptanfragen prüfen</h3>
        <p>
          Unter "Rezeptanfragen" sehen Sie alle eingegangenen Anfragen. Prüfen Sie 
          die medizinischen Informationen und den Fragebogen des Patienten.
        </p>
        <h3 className="font-medium mt-4">Rezept ausstellen</h3>
        <p>
          Nach Prüfung können Sie ein Rezept direkt über die Plattform ausstellen. 
          Geben Sie Dosierung, Anwendungsdauer und weitere Informationen an.
        </p>
        <Alert className="mt-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Wichtiger Hinweis</AlertTitle>
          <AlertDescription>
            Achten Sie darauf, dass alle ausgestellten Rezepte den gesetzlichen Anforderungen entsprechen. 
            Die Plattform unterstützt Sie dabei mit den notwendigen Formularfeldern.
          </AlertDescription>
        </Alert>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PrescriptionManagementItem;
