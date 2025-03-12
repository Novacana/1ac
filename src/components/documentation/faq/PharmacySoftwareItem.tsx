
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const PharmacySoftwareItem: React.FC = () => {
  return (
    <AccordionItem value="item-3">
      <AccordionTrigger>Wie kann ich meine Apothekensoftware anbinden?</AccordionTrigger>
      <AccordionContent>
        <p>
          Gehen Sie zu "Apotheken-Management" {'>'} "Integrationen" {'>'} "Apothekensysteme" und wählen 
          Sie Ihr System aus der Liste aus. Folgen Sie dann den spezifischen Anweisungen für 
          Ihr System.
        </p>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PharmacySoftwareItem;
