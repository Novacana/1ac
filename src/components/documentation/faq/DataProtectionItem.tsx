
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const DataProtectionItem: React.FC = () => {
  return (
    <AccordionItem value="item-5">
      <AccordionTrigger>Wie werden meine Daten geschützt?</AccordionTrigger>
      <AccordionContent>
        <p>
          Alle Daten werden verschlüsselt gespeichert und übertragen. Wir verwenden eine 
          Ende-zu-Ende-Verschlüsselung für besonders sensible Informationen wie Patientendaten 
          und Rezepte. Unsere Infrastruktur wird regelmäßig von unabhängigen Experten auf 
          Sicherheitslücken überprüft.
        </p>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DataProtectionItem;
