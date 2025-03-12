
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const AccountSecurityItem: React.FC = () => {
  return (
    <AccordionItem value="item-1">
      <AccordionTrigger>Wie sichere ich mein Konto?</AccordionTrigger>
      <AccordionContent>
        <p>
          Verwenden Sie ein starkes Passwort und aktivieren Sie die Zwei-Faktor-Authentifizierung 
          in Ihren Kontoeinstellungen. Teilen Sie Ihre Zugangsdaten niemals mit anderen Personen.
        </p>
      </AccordionContent>
    </AccordionItem>
  );
};

export default AccountSecurityItem;
