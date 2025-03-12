
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { FileText, Upload, UserCircle, Clock } from "lucide-react";

const PatientDocumentsItem: React.FC = () => {
  return (
    <AccordionItem value="item-8">
      <AccordionTrigger>Wie kann ich meinen Patienten zusätzliche Dokumente bereitstellen?</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Dokumente hochladen
        </h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Navigieren Sie zu <Link to="/doctor-dashboard" className="text-primary underline">Arzt-Dashboard</Link>
          </li>
          <li>
            Klicken Sie im linken Menü auf <span className="font-medium">Dokumente</span>
          </li>
          <li>
            Klicken Sie auf <span className="font-medium">+ Neues Dokument</span>
          </li>
          <li>
            Wählen Sie die Datei von Ihrem Computer aus (Unterstützte Formate: PDF, DOCX, JPG, PNG)
          </li>
          <li>
            Geben Sie einen Titel und optional eine Beschreibung für das Dokument ein
          </li>
          <li>
            Wählen Sie die Kategorie des Dokuments (z.B. Befund, Aufklärung, Anleitung)
          </li>
        </ol>
        
        <h3 className="font-medium mt-2 flex items-center gap-2">
          <UserCircle className="h-4 w-4" />
          Dokumente Patienten zuweisen
        </h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Nach dem Hochladen klicken Sie auf <span className="font-medium">Patienten zuweisen</span>
          </li>
          <li>
            Sie können einzelne Patienten auswählen oder Patientengruppen basierend auf Kriterien wie Diagnose, Alter oder letztem Besuch
          </li>
          <li>
            Optional können Sie eine persönliche Nachricht hinzufügen, die der Patient zusammen mit dem Dokument erhält
          </li>
          <li>
            Klicken Sie auf <span className="font-medium">Zuweisen</span>, um den Vorgang abzuschließen
          </li>
        </ol>
        
        <h3 className="font-medium mt-2 flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Zeitgesteuerte Bereitstellung
        </h3>
        <p>
          Sie können Dokumente auch zeitgesteuert bereitstellen:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Wählen Sie bei der Zuweisung die Option <span className="font-medium">Zeitgesteuert</span>
          </li>
          <li>
            Legen Sie das Datum und die Uhrzeit fest, wann das Dokument für den Patienten sichtbar sein soll
          </li>
          <li>
            Wählen Sie optional ein Ablaufdatum, nach dem das Dokument nicht mehr zugänglich ist
          </li>
        </ol>
        
        <h3 className="font-medium mt-2 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Patienten-Ansicht
        </h3>
        <p>
          Patienten können die ihnen zugewiesenen Dokumente in ihrem <Link to="/dashboard" className="text-primary underline">Patienten-Portal</Link> unter <span className="font-medium">Meine Dokumente</span> einsehen und herunterladen. 
          Sie erhalten eine E-Mail-Benachrichtigung, wenn neue Dokumente verfügbar sind.
        </p>
      </AccordionContent>
    </AccordionItem>
  );
};

export default PatientDocumentsItem;
