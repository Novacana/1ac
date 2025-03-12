
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, AlertTriangle, Building } from "lucide-react";

const PharmacistTabContent: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Apotheken-Management
        </CardTitle>
        <CardDescription>
          Anleitung zur Verwaltung Ihrer Apotheke auf der Plattform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <Accordion type="single" collapsible className="w-full">
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
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Rezeptabwicklung</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <h3 className="font-medium">Eingegangene Rezepte</h3>
                <p>
                  Unter "Rezepte" finden Sie alle elektronischen Rezepte, die für Ihre Apotheke 
                  eingegangen sind. Prüfen Sie die Details und bestätigen Sie die Annahme.
                </p>
                <h3 className="font-medium mt-4">Rezepteinlösung</h3>
                <p>
                  Nach Prüfung eines Rezepts können Sie es einlösen. Wählen Sie die entsprechenden 
                  Produkte aus Ihrem Sortiment und bestätigen Sie die Abgabe.
                </p>
                <Alert variant="destructive" className="mt-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Rechtlicher Hinweis</AlertTitle>
                  <AlertDescription>
                    Stellen Sie sicher, dass die Abgabe von verschreibungspflichtigen Medikamenten 
                    gemäß den geltenden gesetzlichen Bestimmungen erfolgt.
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

export default PharmacistTabContent;
