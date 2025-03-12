
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const TelemedicineItem: React.FC = () => {
  return (
    <AccordionItem value="item-3">
      <AccordionTrigger>Telemedizinische Beratung</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <h3 className="font-medium">Videosprechstunde starten</h3>
        <p>
          Für eine telemedizinische Beratung wählen Sie einen Patienten aus und klicken 
          auf "Videosprechstunde". Der Patient erhält automatisch eine Einladung per E-Mail.
        </p>
        <h3 className="font-medium mt-4">Technische Voraussetzungen</h3>
        <p>
          Stellen Sie sicher, dass Sie einen modernen Browser (Chrome, Firefox, Safari) 
          verwenden und Zugriff auf Kamera und Mikrofon gewähren.
        </p>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TelemedicineItem;
