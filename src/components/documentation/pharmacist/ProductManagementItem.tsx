
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const ProductManagementItem: React.FC = () => {
  return (
    <AccordionItem value="item-1">
      <AccordionTrigger>Produktverwaltung</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <h3 className="font-medium">Produkte hinzufügen und bearbeiten</h3>
        <p>
          Unter "Produkte" können Sie Ihr Sortiment verwalten. Klicken Sie auf 
          "Neues Produkt", um ein Produkt hinzuzufügen, oder bearbeiten Sie 
          bestehende Produkte direkt in der Tabelle.
        </p>
        <h3 className="font-medium mt-4">Massenimport von Produkten</h3>
        <p>
          Nutzen Sie die Import-Funktion, um mehrere Produkte gleichzeitig 
          hochzuladen. Die Plattform unterstützt CSV-Dateien mit einer 
          vordefinierten Struktur.
        </p>
        <div className="relative rounded-md overflow-hidden mt-4">
          <img 
            src="/lovable-uploads/ec590630-2962-446a-b8cc-9b7fce1ae53a.png" 
            alt="Produktverwaltung" 
            className="w-full h-auto rounded-md"
          />
          <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ProductManagementItem;
