
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const PatientDataImportItem: React.FC = () => {
  return (
    <AccordionItem value="item-6">
      <AccordionTrigger>Kann ich meine bestehenden Patientendaten importieren?</AccordionTrigger>
      <AccordionContent>
        <p>
          Ja, Sie können bestehende Patientendaten über die Import-Funktion im Arzt-Dashboard 
          hochladen. Unterstützte Formate sind CSV und XML. Beachten Sie, dass Sie für den 
          Import die Einwilligung Ihrer Patienten benötigen.
        </p>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PatientDataImportItem;
