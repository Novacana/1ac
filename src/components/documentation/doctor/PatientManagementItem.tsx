
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const PatientManagementItem: React.FC = () => {
  return (
    <AccordionItem value="item-1">
      <AccordionTrigger>Patientenmanagement</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <h3 className="font-medium">Patientenakten einsehen</h3>
        <p>
          Im Bereich "Patienten" finden Sie alle Ihre registrierten Patienten. 
          Klicken Sie auf einen Patienten, um dessen vollständige Akte einzusehen.
        </p>
        <h3 className="font-medium mt-4">Neue Patienten hinzufügen</h3>
        <p>
          Klicken Sie auf "Neuer Patient", um einen neuen Patienten zu registrieren. 
          Füllen Sie alle erforderlichen Felder aus und klicken Sie auf "Speichern".
        </p>
        <div className="relative rounded-md overflow-hidden mt-4">
          <img 
            src="/lovable-uploads/d309619a-3ff7-42f3-b273-ab1586713f9f.png" 
            alt="Patientenmanagement" 
            className="w-full h-auto rounded-md"
          />
          <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PatientManagementItem;
