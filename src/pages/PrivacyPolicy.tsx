
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Info, Lock, UserCheck, Database, File, AlertCircle } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Datenschutzrichtlinie</h1>
          <p className="text-muted-foreground mb-6">
            Letzte Aktualisierung: {new Date().toLocaleDateString()}
          </p>

          <Card className="mb-8">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle>Datenschutz gemäß DSGVO und HIPAA</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                1A Cannabis nimmt den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften, insbesondere der Datenschutz-Grundverordnung (DSGVO) und dem Health Insurance Portability and Accountability Act (HIPAA).
              </p>
              <p>
                Diese Datenschutzrichtlinie informiert Sie über die Art, den Umfang und den Zweck der Verarbeitung personenbezogener und gesundheitsbezogener Daten in unserer Anwendung.
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="allgemein" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4 w-full">
              <TabsTrigger value="allgemein">Allgemein</TabsTrigger>
              <TabsTrigger value="datenerhebung">Datenerhebung</TabsTrigger>
              <TabsTrigger value="rechte">Ihre Rechte</TabsTrigger>
              <TabsTrigger value="technisch">Technische Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="allgemein" className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
                  <Info className="h-5 w-5 text-primary" />
                  Verantwortlicher
                </h2>
                <p className="mb-2">
                  Verantwortlicher im Sinne der Datenschutz-Grundverordnung und anderer nationaler Datenschutzgesetze sowie sonstiger datenschutzrechtlicher Bestimmungen ist:
                </p>
                <div className="pl-4">
                  <p>1A Cannabis GmbH</p>
                  <p>Musterstraße 123</p>
                  <p>12345 Musterstadt</p>
                  <p>Deutschland</p>
                  <p>E-Mail: datenschutz@1a-cannabis.de</p>
                  <p>Telefon: +49 123 456789</p>
                </div>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
                  <Lock className="h-5 w-5 text-primary" />
                  Datenschutzbeauftragter
                </h2>
                <p className="mb-2">
                  Unseren Datenschutzbeauftragten erreichen Sie unter:
                </p>
                <div className="pl-4">
                  <p>Max Mustermann</p>
                  <p>E-Mail: dsb@1a-cannabis.de</p>
                </div>
              </section>
            </TabsContent>
            
            <TabsContent value="datenerhebung" className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
                  <Database className="h-5 w-5 text-primary" />
                  Welche Daten wir erheben
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Bestelldaten</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Wenn Sie Produkte in unserem Shop bestellen, erheben wir:
                    </p>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li>Name, Anschrift, E-Mail-Adresse und Telefonnummer</li>
                      <li>Zahlungsinformationen (jedoch keine vollständigen Kreditkartendaten)</li>
                      <li>Bestellhistorie und gekaufte Produkte</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Medizinische Daten</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Bei Rezeptanfragen oder Beratung durch medizinisches Fachpersonal:
                    </p>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li>Gesundheitsbezogene Informationen und Symptome</li>
                      <li>Rezeptinformationen und Medikationshistorie</li>
                      <li>Arztberichte und Diagnosen (wenn von Ihnen bereitgestellt)</li>
                    </ul>
                    <p className="text-sm mt-2 bg-amber-50 dark:bg-amber-950 p-2 rounded-md border border-amber-200 dark:border-amber-800">
                      <AlertCircle className="h-4 w-4 inline-block mr-1 text-amber-600 dark:text-amber-400" />
                      Diese Daten unterliegen besonderem Schutz nach DSGVO und HIPAA und werden nur mit Ihrer ausdrücklichen Einwilligung erhoben und verarbeitet.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-1">Technische Daten</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      Bei der Nutzung unserer App werden automatisch erfasst:
                    </p>
                    <ul className="list-disc pl-6 text-sm space-y-1">
                      <li>IP-Adresse und Geräteinformationen</li>
                      <li>Datum und Uhrzeit der Anfragen</li>
                      <li>Interaktionen mit der App (anonymisiert)</li>
                      <li>Verwendeter Browser und Betriebssystem</li>
                    </ul>
                  </div>
                </div>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
                  <File className="h-5 w-5 text-primary" />
                  Zweck der Datenverarbeitung
                </h2>
                <div className="space-y-3">
                  <p className="text-sm">
                    Wir verarbeiten Ihre Daten für folgende Zwecke:
                  </p>
                  <ul className="list-disc pl-6 text-sm space-y-2">
                    <li>Abwicklung von Bestellungen und Bereitstellung unserer Dienstleistungen</li>
                    <li>Kommunikation bezüglich Ihrer Bestellungen und Anfragen</li>
                    <li>Unterstützung bei medizinischen Fragestellungen und Rezeptanfragen (bei entsprechender Einwilligung)</li>
                    <li>Verbesserung unserer App und Dienstleistungen</li>
                    <li>Erfüllung rechtlicher Verpflichtungen, insbesondere im medizinischen Bereich</li>
                  </ul>
                </div>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
                  <Lock className="h-5 w-5 text-primary" />
                  FHIR-Standard für Gesundheitsdaten
                </h2>
                <p className="text-sm mb-2">
                  Für den Austausch von Gesundheitsdaten verwenden wir den Fast Healthcare Interoperability Resources (FHIR) Standard, um:
                </p>
                <ul className="list-disc pl-6 text-sm space-y-1">
                  <li>Die Interoperabilität und Sicherheit Ihrer medizinischen Daten zu gewährleisten</li>
                  <li>Den sicheren Austausch von Informationen mit Gesundheitsdienstleistern zu ermöglichen</li>
                  <li>Internationale Standards für den Schutz von Gesundheitsdaten einzuhalten</li>
                </ul>
              </section>
            </TabsContent>
            
            <TabsContent value="rechte" className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
                  <UserCheck className="h-5 w-5 text-primary" />
                  Ihre Rechte
                </h2>
                <p className="mb-4 text-sm">
                  Nach der DSGVO haben Sie folgende Rechte bezüglich Ihrer bei uns gespeicherten Daten:
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="border rounded-lg p-3">
                    <h3 className="font-medium mb-1">Auskunftsrecht</h3>
                    <p className="text-sm text-muted-foreground">
                      Sie haben das Recht zu erfahren, welche Daten wir über Sie gespeichert haben.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h3 className="font-medium mb-1">Recht auf Berichtigung</h3>
                    <p className="text-sm text-muted-foreground">
                      Sie können verlangen, dass unrichtige Daten korrigiert werden.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h3 className="font-medium mb-1">Recht auf Löschung</h3>
                    <p className="text-sm text-muted-foreground">
                      Sie können verlangen, dass Ihre Daten gelöscht werden.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h3 className="font-medium mb-1">Recht auf Einschränkung</h3>
                    <p className="text-sm text-muted-foreground">
                      Sie können die Verarbeitung Ihrer Daten einschränken lassen.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h3 className="font-medium mb-1">Recht auf Datenübertragbarkeit</h3>
                    <p className="text-sm text-muted-foreground">
                      Sie können Ihre Daten in einem strukturierten Format erhalten.
                    </p>
                  </div>
                  
                  <div className="border rounded-lg p-3">
                    <h3 className="font-medium mb-1">Widerspruchsrecht</h3>
                    <p className="text-sm text-muted-foreground">
                      Sie können der Verarbeitung Ihrer Daten widersprechen.
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 text-sm">
                  <p>
                    Um Ihre Rechte auszuüben, kontaktieren Sie uns bitte unter <span className="font-medium">datenschutz@1a-cannabis.de</span>.
                  </p>
                  <p className="mt-2">
                    Sie haben außerdem das Recht, eine Beschwerde bei einer Aufsichtsbehörde einzureichen.
                  </p>
                </div>
              </section>
            </TabsContent>
            
            <TabsContent value="technisch" className="space-y-6">
              <section>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
                  <Lock className="h-5 w-5 text-primary" />
                  Datensicherheit
                </h2>
                <p className="mb-3 text-sm">
                  Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, um Ihre Daten gegen zufällige oder vorsätzliche Manipulationen, Verlust, Zerstörung oder gegen den Zugriff unberechtigter Personen zu schützen.
                </p>
                <ul className="list-disc pl-6 text-sm space-y-1 mb-3">
                  <li>Verschlüsselung aller Datenübertragungen (SSL/TLS)</li>
                  <li>Verschlüsselte Speicherung sensibler Daten</li>
                  <li>Regelmäßige Sicherheitsaudits und Penetrationstests</li>
                  <li>Zugriffsbeschränkungen und Berechtigungskonzepte</li>
                  <li>Pseudonymisierung wo technisch möglich</li>
                </ul>
                <p className="text-sm bg-primary/10 p-3 rounded-md">
                  Für medizinische Daten gelten besonders strenge Sicherheitsanforderungen gemäß HIPAA und DSGVO, die wir vollumfänglich implementiert haben.
                </p>
              </section>
              
              <Separator />
              
              <section>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
                  <Info className="h-5 w-5 text-primary" />
                  Cookies und Tracking
                </h2>
                <p className="mb-3 text-sm">
                  Unsere App verwendet Cookies und ähnliche Technologien:
                </p>
                <div className="space-y-3 text-sm">
                  <div>
                    <h3 className="font-medium">Notwendige Cookies</h3>
                    <p className="text-muted-foreground">Diese sind erforderlich, damit die App funktioniert.</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Präferenz-Cookies</h3>
                    <p className="text-muted-foreground">Diese speichern Ihre Einstellungen.</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Statistik-Cookies</h3>
                    <p className="text-muted-foreground">Diese helfen uns, die Nutzung der App zu verstehen.</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Marketing-Cookies</h3>
                    <p className="text-muted-foreground">Diese werden nur mit Ihrer Einwilligung gesetzt.</p>
                  </div>
                </div>
                <p className="mt-3 text-sm">
                  Sie können Ihre Cookie-Einstellungen jederzeit über den Dialog zur Cookie-Einwilligung ändern.
                </p>
              </section>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 text-sm text-muted-foreground border-t pt-4">
            <p>
              Wir behalten uns vor, diese Datenschutzrichtlinie anzupassen, um sie an geänderte Rechtslagen oder bei Änderungen des Dienstes sowie der Datenverarbeitung anzupassen.
            </p>
            <p className="mt-2">
              © {new Date().getFullYear()} 1A Cannabis GmbH - Alle Rechte vorbehalten
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;
