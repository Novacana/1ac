
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const PharmacySoftwareItem: React.FC = () => {
  return (
    <AccordionItem value="item-3">
      <AccordionTrigger>Wie kann ich meine Apothekensoftware anbinden?</AccordionTrigger>
      <AccordionContent className="space-y-3">
        <p>
          Folgen Sie diesen Schritten, um Ihre Apothekensoftware anzubinden:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Navigieren Sie zu <Link to="/pharmacy-management" className="text-primary underline">Apotheken-Management</Link>
          </li>
          <li>
            Klicken Sie im linken Menü auf <span className="font-medium">Integrationen</span>
          </li>
          <li>
            Wählen Sie den Tab <span className="font-medium">Apothekensysteme</span>
          </li>
          <li>
            Wählen Sie Ihr System aus der angezeigten Liste aus:
            <ul className="list-disc pl-5 mt-1">
              <li>LAUER-FISCHER (WINAPO)</li>
              <li>Pharmatechnik (IXOS)</li>
              <li>awinta (PROKAS)</li>
              <li>Weitere Systeme</li>
            </ul>
          </li>
          <li>
            Klicken Sie auf <span className="font-medium">Konfigurieren</span> und folgen Sie den systemspezifischen Anweisungen
          </li>
          <li>
            Nachdem Sie alle erforderlichen Informationen eingegeben haben, klicken Sie auf <span className="font-medium">Verbindung testen</span>, um die Anbindung zu prüfen
          </li>
        </ol>
        <p>
          Bei Fragen zur Integration kontaktieren Sie unseren <Link to="/support" className="text-primary underline">technischen Support</Link>.
        </p>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PharmacySoftwareItem;
