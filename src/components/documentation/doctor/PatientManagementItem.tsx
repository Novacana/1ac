
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const PatientManagementItem: React.FC = () => {
  return (
    <AccordionItem value="item-1">
      <AccordionTrigger>Patientenmanagement</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <h3 className="font-medium">Patientenakten einsehen</h3>
        <p>
          Im Bereich <Link to="/doctor-dashboard" className="text-primary underline">Patienten</Link> finden Sie alle Ihre registrierten Patienten. 
          Klicken Sie auf einen Patienten, um dessen vollständige Akte einzusehen. Sie können nach Patienten suchen, 
          filtern und sortieren, um schnell die gewünschten Informationen zu finden.
        </p>
        <h3 className="font-medium mt-4">Neue Patienten hinzufügen</h3>
        <p>
          Klicken Sie auf <span className="font-medium">+&nbsp;Neuer Patient</span> in der <Link to="/doctor-dashboard" className="text-primary underline">Patientenübersicht</Link>, 
          um einen neuen Patienten zu registrieren. Füllen Sie alle erforderlichen Felder aus (markiert mit *) 
          und klicken Sie auf <span className="font-medium">Speichern</span>. Achten Sie besonders auf die korrekte Eingabe 
          der Kontaktdaten, um eine reibungslose Kommunikation zu gewährleisten.
        </p>
        <h3 className="font-medium mt-4">Patientendaten bearbeiten</h3>
        <p>
          In der <Link to="/doctor-dashboard" className="text-primary underline">Patientendetailansicht</Link> können 
          Sie auf <span className="font-medium">Bearbeiten</span> klicken, um die Patientendaten zu aktualisieren. 
          Alle Änderungen werden automatisch protokolliert, um die Nachvollziehbarkeit gemäß DSGVO-Richtlinien 
          zu gewährleisten.
        </p>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PatientManagementItem;
