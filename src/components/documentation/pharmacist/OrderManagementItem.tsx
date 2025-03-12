
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const OrderManagementItem: React.FC = () => {
  return (
    <AccordionItem value="item-2">
      <AccordionTrigger>Bestellungsverwaltung</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <h3 className="font-medium">Eingehende Bestellungen</h3>
        <p>
          Unter "Bestellungen" sehen Sie alle eingegangenen Bestellungen. 
          Sie können nach Status filtern und Details jeder Bestellung einsehen.
        </p>
        <h3 className="font-medium mt-4">Bestellstatus aktualisieren</h3>
        <p>
          Aktualisieren Sie den Status einer Bestellung über das Dropdown-Menü. 
          Optionen sind: "In Bearbeitung", "Versendet", "Geliefert" und "Storniert".
        </p>
        <Alert className="mt-4">
          <Info className="h-4 w-4" />
          <AlertTitle>Automatische Benachrichtigungen</AlertTitle>
          <AlertDescription>
            Bei jeder Statusänderung wird der Kunde automatisch per E-Mail benachrichtigt. 
            Sie können diese E-Mails in den Einstellungen anpassen.
          </AlertDescription>
        </Alert>
      </AccordionContent>
    </AccordionItem>
  );
};

export default OrderManagementItem;
