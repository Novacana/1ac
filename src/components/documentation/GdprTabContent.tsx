
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText, AlertTriangle } from "lucide-react";

const GdprTabContent: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          DSGVO-Konformität
        </CardTitle>
        <CardDescription>
          Informationen zur Einhaltung der Datenschutz-Grundverordnung
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">Überblick zur DSGVO</h3>
              <p className="mt-2">
                Die Datenschutz-Grundverordnung (DSGVO) ist eine EU-Verordnung, die den Schutz 
                personenbezogener Daten regelt. Sie gilt für alle Unternehmen, die personenbezogene 
                Daten von EU-Bürgern verarbeiten.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Rechtmäßige Datenverarbeitung</h3>
              <p className="mt-2">
                Jede Verarbeitung personenbezogener Daten muss auf einer Rechtsgrundlage basieren. 
                Die wichtigsten Rechtsgrundlagen sind:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Einwilligung der betroffenen Person</li>
                <li>Erfüllung eines Vertrags</li>
                <li>Rechtliche Verpflichtung</li>
                <li>Lebenswichtige Interessen</li>
                <li>Öffentliches Interesse</li>
                <li>Berechtigtes Interesse</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Pflichten als Arzt oder Apotheker</h3>
              <p className="mt-2">
                Als Arzt oder Apotheker unterliegen Sie besonders strengen Anforderungen, da 
                Sie mit Gesundheitsdaten umgehen, die als besondere Kategorie personenbezogener 
                Daten eingestuft werden.
              </p>
              <div className="mt-4 space-y-4">
                <div>
                  <h4 className="font-medium">Technische und organisatorische Maßnahmen</h4>
                  <p className="mt-1">
                    Implementieren Sie geeignete Sicherheitsmaßnahmen zum Schutz der Daten:
                  </p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Verschlüsselung von Daten</li>
                    <li>Zugriffskontrollen und Rechteverwaltung</li>
                    <li>Regelmäßige Backups</li>
                    <li>Sichere Passwörter und Zwei-Faktor-Authentifizierung</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">Dokumentationspflichten</h4>
                  <p className="mt-1">
                    Führen Sie ein Verzeichnis von Verarbeitungstätigkeiten, das folgende Informationen enthält:
                  </p>
                  <ul className="list-disc pl-5 mt-1">
                    <li>Zweck der Datenverarbeitung</li>
                    <li>Kategorien betroffener Personen und Daten</li>
                    <li>Empfänger der Daten</li>
                    <li>Fristen für die Löschung</li>
                    <li>Beschreibung der Sicherheitsmaßnahmen</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Datenschutz-Folgenabschätzung</h3>
              <p className="mt-2">
                Für die Verarbeitung von Gesundheitsdaten ist in der Regel eine Datenschutz-Folgenabschätzung 
                erforderlich. Diese umfasst:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Systematische Beschreibung der Verarbeitungsvorgänge</li>
                <li>Bewertung der Notwendigkeit und Verhältnismäßigkeit</li>
                <li>Risikobewertung für die Rechte und Freiheiten der betroffenen Personen</li>
                <li>Maßnahmen zur Bewältigung der Risiken</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Einwilligung der Patienten</h3>
              <p className="mt-2">
                Die Einwilligung muss freiwillig, spezifisch, informiert und eindeutig sein:
              </p>
              <ul className="list-disc pl-5 mt-2">
                <li>Verwenden Sie klare und einfache Sprache</li>
                <li>Vermeiden Sie vorangekreuzte Kästchen</li>
                <li>Informieren Sie über das Recht auf Widerruf</li>
                <li>Dokumentieren Sie die Einwilligung</li>
              </ul>
            </div>
            
            <Alert className="mt-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Datenschutzverletzungen</AlertTitle>
              <AlertDescription>
                Bei einer Verletzung des Schutzes personenbezogener Daten müssen Sie die zuständige 
                Aufsichtsbehörde innerhalb von 72 Stunden benachrichtigen, sofern ein Risiko für die 
                Rechte und Freiheiten der betroffenen Personen besteht.
              </AlertDescription>
            </Alert>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default GdprTabContent;
