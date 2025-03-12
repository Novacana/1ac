
import React, { useState } from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Info, AlertTriangle, FileText, Settings, Building, BookOpen, User } from "lucide-react";

const Documentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("doctors");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Dokumentation</h1>
          <p className="text-muted-foreground mb-8">
            Umfassende Anleitung für Ärzte und Apotheker zur Nutzung der Plattform
          </p>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="doctors">Für Ärzte</TabsTrigger>
              <TabsTrigger value="pharmacists">Für Apotheker</TabsTrigger>
              <TabsTrigger value="gdpr">DSGVO-Konformität</TabsTrigger>
              <TabsTrigger value="faq">Häufige Fragen</TabsTrigger>
            </TabsList>

            <TabsContent value="doctors" className="space-y-6">
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
            </TabsContent>

            <TabsContent value="pharmacists" className="space-y-6">
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
            </TabsContent>

            <TabsContent value="gdpr" className="space-y-6">
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
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Documentation;
