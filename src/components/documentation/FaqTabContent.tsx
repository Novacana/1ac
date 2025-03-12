
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";

const FaqTabContent: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Häufig gestellte Fragen
        </CardTitle>
        <CardDescription>
          Antworten auf die häufigsten Fragen zur Nutzung der Plattform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Wie sichere ich mein Konto?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Verwenden Sie ein starkes Passwort und aktivieren Sie die Zwei-Faktor-Authentifizierung 
                  in Ihren Kontoeinstellungen. Teilen Sie Ihre Zugangsdaten niemals mit anderen Personen.
                </p>
              </AccordionContent>
            </AccordionItem>
            
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
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Wie kann ich meine Apothekensoftware anbinden?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Gehen Sie zu "Apotheken-Management" {'>'} "Integrationen" {'>'} "Apothekensysteme" und wählen 
                  Sie Ihr System aus der Liste aus. Folgen Sie dann den spezifischen Anweisungen für 
                  Ihr System.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Wie funktioniert die E-Rezept-Funktion?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Als Arzt stellen Sie ein Rezept im System aus und signieren es digital. Der Patient 
                  erhält das Rezept in seinem Konto und kann es einer Apotheke seiner Wahl zuweisen. 
                  Die Apotheke sieht das Rezept dann in ihrem Dashboard und kann es bearbeiten.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>Wie werden meine Daten geschützt?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Alle Daten werden verschlüsselt gespeichert und übertragen. Wir verwenden eine 
                  Ende-zu-Ende-Verschlüsselung für besonders sensible Informationen wie Patientendaten 
                  und Rezepte. Unsere Infrastruktur wird regelmäßig von unabhängigen Experten auf 
                  Sicherheitslücken überprüft.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger>Kann ich meine bestehenden Patientendaten importieren?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Ja, Sie können bestehende Patientendaten über die Import-Funktion im Arzt-Dashboard 
                  hochladen. Unterstützte Formate sind CSV und XML. Beachten Sie, dass Sie für den 
                  Import die Einwilligung Ihrer Patienten benötigen.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger>Wie funktioniert die Videosprechstunde?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Die Videosprechstunde basiert auf WebRTC-Technologie und funktioniert direkt im Browser. 
                  Als Arzt können Sie eine Sprechstunde planen oder spontan starten. Der Patient erhält 
                  einen Link zum Beitritt. Die Verbindung ist Ende-zu-Ende verschlüsselt und DSGVO-konform.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-8">
              <AccordionTrigger>Wie kann ich meinen Patienten zusätzliche Dokumente bereitstellen?</AccordionTrigger>
              <AccordionContent>
                <p>
                  Im Arzt-Dashboard können Sie unter "Dokumente" beliebige Dateien hochladen und 
                  einzelnen Patienten zuweisen. Die Patienten können diese Dokumente dann in ihrem 
                  eigenen Konto einsehen und herunterladen.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default FaqTabContent;
