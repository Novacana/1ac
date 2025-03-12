
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const EPrescriptionItem: React.FC = () => {
  return (
    <AccordionItem value="item-4">
      <AccordionTrigger>Wie funktioniert die E-Rezept-Funktion?</AccordionTrigger>
      <AccordionContent>
        <p>
          Als Arzt stellen Sie ein Rezept im System aus und signieren es digital. Der Patient 
          erhält das Rezept in seinem Konto und kann es einer Apotheke seiner Wahl zuweisen. 
          Die Apotheke sieht das Rezept dann in ihrem Dashboard und kann es bearbeiten.
        </p>
      </AccordionContent>
    </AccordionItem>
  );
};

export default EPrescriptionItem;
