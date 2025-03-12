
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const PatientDocumentsItem: React.FC = () => {
  return (
    <AccordionItem value="item-8">
      <AccordionTrigger>Wie kann ich meinen Patienten zusätzliche Dokumente bereitstellen?</AccordionTrigger>
      <AccordionContent>
        <p>
          Im Arzt-Dashboard können Sie unter "Dokumente" beliebige Dateien hochladen und 
          einzelnen Patienten zuweisen. Die Patienten können diese Dokumente dann in ihrem 
          eigenen Konto einsehen und herunterladen.
        </p>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PatientDocumentsItem;
