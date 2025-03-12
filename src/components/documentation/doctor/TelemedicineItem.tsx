
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";

const TelemedicineItem: React.FC = () => {
  return (
    <AccordionItem value="item-3">
      <AccordionTrigger>Videosprechstunde</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <h3 className="font-medium">Videosprechstunde starten</h3>
        <p>
          Um eine Videosprechstunde zu starten, navigieren Sie zu <Link to="/doctor-dashboard" className="text-primary underline">Videosprechstunde</Link> in 
          Ihrem Dashboard. Sie sehen eine Liste der geplanten Sprechstunden. Klicken Sie bei der gewünschten 
          Sprechstunde auf <span className="font-medium">Beitreten</span>, um die Sitzung zu starten.
        </p>
        
        <h3 className="font-medium mt-4">Neue Videosprechstunde planen</h3>
        <p>
          Es gibt zwei Möglichkeiten, eine neue Videosprechstunde zu planen:
        </p>
        <ol className="list-decimal pl-5 space-y-2 mt-2">
          <li>
            Über <Link to="/doctor-dashboard" className="text-primary underline">Videosprechstunde</Link>: Klicken Sie auf 
            <span className="font-medium"> Neue Sprechstunde</span>, wählen Sie Datum und Uhrzeit aus und geben Sie den Namen des 
            Patienten ein.
          </li>
          <li>
            Über den <Link to="/doctor-dashboard" className="text-primary underline">Kalender</Link>: Klicken Sie auf 
            <span className="font-medium"> Neuer Termin</span>, wählen Sie als Termintyp "Videosprechstunde" aus und füllen 
            Sie alle erforderlichen Felder aus.
          </li>
        </ol>
        
        <h3 className="font-medium mt-4">Während der Videosprechstunde</h3>
        <p>
          In der aktiven Videosprechstunde stehen Ihnen folgende Funktionen zur Verfügung:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Chat-Funktion für Textnachrichten</li>
          <li>Bildschirmfreigabe für Befunde oder Dokumente</li>
          <li>Einladen weiterer Teilnehmer (z.B. Fachkollegen für Zweitmeinung)</li>
          <li>Kamera und Mikrofon stummschalten</li>
        </ul>
        
        <h3 className="font-medium mt-4">Dokumentation der Videosprechstunde</h3>
        <p>
          Nach der Videosprechstunde können Sie direkt Notizen in der Patientenakte hinterlegen. Navigieren Sie dazu zu 
          <Link to="/doctor-dashboard" className="text-primary underline"> Patientenverwaltung</Link> und wählen Sie den 
          entsprechenden Patienten aus.
        </p>
        
        <p className="text-sm text-muted-foreground mt-4">
          <strong>Hinweis:</strong> Alle Videosprechstunden sind Ende-zu-Ende verschlüsselt und entsprechen den DSGVO- und 
          HIPAA-Richtlinien. Es werden keine Videoinhalte aufgezeichnet oder gespeichert, sofern nicht eine 
          ausdrückliche Einwilligung des Patienten vorliegt.
        </p>
      </AccordionContent>
    </AccordionItem>
  );
};

export default TelemedicineItem;
