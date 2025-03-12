
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const IntegrationsItem: React.FC = () => {
  return (
    <AccordionItem value="item-3">
      <AccordionTrigger>Integrationen</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <h3 className="font-medium">Apothekensysteme anbinden</h3>
        <p>
          Verbinden Sie Ihr Warenwirtschaftssystem mit der Plattform. 
          Unterstützt werden gängige Systeme wie LAUER-FISCHER, Pharmatechnik und awinta.
        </p>
        <h3 className="font-medium mt-4">API-Nutzung</h3>
        <p>
          Für fortgeschrittene Integrationen steht eine API zur Verfügung. 
          Generieren Sie einen API-Schlüssel und richten Sie Webhooks für Echtzeitbenachrichtigungen ein.
        </p>
        <h3 className="font-medium mt-4">E-Commerce-Integrationen</h3>
        <p>
          Verbinden Sie Ihren bestehenden Webshop oder andere E-Commerce-Plattformen, 
          um eine zentrale Produktverwaltung zu ermöglichen.
        </p>
      </AccordionContent>
    </AccordionItem>
  );
};

export default IntegrationsItem;
