
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const BrowserSupportItem: React.FC = () => {
  return (
    <AccordionItem value="item-2">
      <AccordionTrigger>Welche Browser werden unterstützt?</AccordionTrigger>
      <AccordionContent>
        <p>
          Die Plattform unterstützt alle modernen Browser in aktuellen Versionen:
        </p>
        <ul className="list-disc pl-5 mt-2">
          <li>Google Chrome (empfohlen)</li>
          <li>Mozilla Firefox</li>
          <li>Microsoft Edge</li>
          <li>Apple Safari</li>
        </ul>
      </AccordionContent>
    </AccordionItem>
  );
};

export default BrowserSupportItem;
