
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, AlertTriangle, User } from "lucide-react";

const DoctorTabContent: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Arzt-Dashboard
        </CardTitle>
        <CardDescription>
          Anleitung zur Nutzung des Arzt-Dashboards
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Patientenmanagement</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <h3 className="font-medium">Patientenakten einsehen</h3>
                <p>
                  Im Bereich "Patienten" finden Sie alle Ihre registrierten Patienten. 
                  Klicken Sie auf einen Patienten, um dessen vollständige Akte einzusehen.
                </p>
                <h3 className="font-medium mt-4">Neue Patienten hinzufügen</h3>
                <p>
                  Klicken Sie auf "Neuer Patient", um einen neuen Patienten zu registrieren. 
                  Füllen Sie alle erforderlichen Felder aus und klicken Sie auf "Speichern".
                </p>
                <div className="relative rounded-md overflow-hidden mt-4">
                  <img 
                    src="/lovable-uploads/d309619a-3ff7-42f3-b273-ab1586713f9f.png" 
                    alt="Patientenmanagement" 
                    className="w-full h-auto rounded-md"
                  />
                  <div className="absolute inset-0 bg-black/5 pointer-events-none"></div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Rezeptverwaltung</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <h3 className="font-medium">Rezeptanfragen prüfen</h3>
                <p>
                  Unter "Rezeptanfragen" sehen Sie alle eingegangenen Anfragen. Prüfen Sie 
                  die medizinischen Informationen und den Fragebogen des Patienten.
                </p>
                <h3 className="font-medium mt-4">Rezept ausstellen</h3>
                <p>
                  Nach Prüfung können Sie ein Rezept direkt über die Plattform ausstellen. 
                  Geben Sie Dosierung, Anwendungsdauer und weitere Informationen an.
                </p>
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Wichtiger Hinweis</AlertTitle>
                  <AlertDescription>
                    Achten Sie darauf, dass alle ausgestellten Rezepte den gesetzlichen Anforderungen entsprechen. 
                    Die Plattform unterstützt Sie dabei mit den notwendigen Formularfeldern.
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>
            
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
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Datenschutz & Dokumentation</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <h3 className="font-medium">Patienteneinwilligung</h3>
                <p>
                  Vor der Behandlung muss der Patient seine Einwilligung zur Datenverarbeitung geben. 
                  Dies geschieht digital über die Plattform und wird dokumentiert.
                </p>
                <h3 className="font-medium mt-4">Behandlungsdokumentation</h3>
                <p>
                  Jede Behandlung sollte sorgfältig dokumentiert werden. Die Plattform bietet 
                  strukturierte Formulare, die die Dokumentation erleichtern.
                </p>
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>DSGVO-Hinweis</AlertTitle>
                  <AlertDescription>
                    Alle Patientendaten werden gemäß DSGVO verschlüsselt gespeichert. 
                    Als Arzt sind Sie mitverantwortlich für den Schutz dieser Daten.
                  </AlertDescription>
                </Alert>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default DoctorTabContent;
