
import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon, AlertTriangle, FileText } from "lucide-react";

const DocumentationTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API-Dokumentation</CardTitle>
          <CardDescription>
            Detaillierte Informationen zur Verwendung unserer API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Übersicht</TabsTrigger>
              <TabsTrigger value="endpoints">Endpunkte</TabsTrigger>
              <TabsTrigger value="auth">Authentifizierung</TabsTrigger>
              <TabsTrigger value="gdpr">DSGVO-Konformität</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <h3 className="text-lg font-medium">Einführung in die API</h3>
              <p>
                Unsere API ermöglicht es Ihnen, programmatisch auf Ihre Apothekendaten zuzugreifen 
                und die Integration mit anderen Systemen zu automatisieren.
              </p>
              <div className="mt-4">
                <h4 className="text-md font-medium">Basis-URL</h4>
                <pre className="bg-muted p-2 rounded-md overflow-x-auto mt-2">
                  <code>https://api.1a-cannabis.de/v1</code>
                </pre>
              </div>
              <div className="mt-4">
                <h4 className="text-md font-medium">Anfrage-Format</h4>
                <p className="mt-1">
                  Alle Anfragen sollten im JSON-Format gesendet werden. Setzen Sie den 
                  Header <code>Content-Type: application/json</code>.
                </p>
              </div>
              <div className="mt-4">
                <h4 className="text-md font-medium">Rate Limiting</h4>
                <p className="mt-1">
                  Die API ist auf 100 Anfragen pro Minute und 10.000 Anfragen pro Tag begrenzt. 
                  Bei Überschreitung erhalten Sie einen 429 Too Many Requests Statuscode.
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="endpoints" className="space-y-4">
              <h3 className="text-lg font-medium">Verfügbare Endpunkte</h3>
              
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="products">
                  <AccordionTrigger>Produkte</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">GET /products</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Liefert eine Liste aller Produkte in Ihrer Apotheke.
                      </p>
                      <h5 className="font-medium text-sm mt-2">Parameter:</h5>
                      <ul className="list-disc pl-5 text-sm">
                        <li><code>limit</code> - Maximale Anzahl zurückgegebener Produkte (Standard: 50)</li>
                        <li><code>offset</code> - Offset für Paginierung (Standard: 0)</li>
                        <li><code>category</code> - Filter nach Kategorie</li>
                      </ul>
                      <h5 className="font-medium text-sm mt-2">Beispielantwort:</h5>
                      <pre className="bg-muted p-2 rounded-md overflow-x-auto mt-1 text-xs">
                        <code>{JSON.stringify({
                          data: [
                            {
                              id: "prod_123",
                              name: "CBD Öl 5%",
                              price: 29.99,
                              stock: 50,
                              category: "Öle",
                              created_at: "2023-01-15T10:30:00Z"
                            }
                          ],
                          meta: {
                            total: 120,
                            limit: 50,
                            offset: 0
                          }
                        }, null, 2)}</code>
                      </pre>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="font-medium">POST /products</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Erstellt ein neues Produkt in Ihrer Apotheke.
                      </p>
                      <h5 className="font-medium text-sm mt-2">Anfragekörper:</h5>
                      <pre className="bg-muted p-2 rounded-md overflow-x-auto mt-1 text-xs">
                        <code>{JSON.stringify({
                          name: "CBD Öl 10%",
                          price: 49.99,
                          stock: 30,
                          category: "Öle",
                          description: "Hochwertiges CBD Öl mit 10% CBD-Gehalt"
                        }, null, 2)}</code>
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="orders">
                  <AccordionTrigger>Bestellungen</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">GET /orders</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Liefert eine Liste aller Bestellungen.
                      </p>
                      <h5 className="font-medium text-sm mt-2">Parameter:</h5>
                      <ul className="list-disc pl-5 text-sm">
                        <li><code>status</code> - Filter nach Status (processing, shipped, delivered, cancelled)</li>
                        <li><code>start_date</code> - Filter nach Startdatum (ISO 8601)</li>
                        <li><code>end_date</code> - Filter nach Enddatum (ISO 8601)</li>
                      </ul>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="font-medium">PATCH /orders/{"{order_id}"}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Aktualisiert den Status einer Bestellung.
                      </p>
                      <h5 className="font-medium text-sm mt-2">Anfragekörper:</h5>
                      <pre className="bg-muted p-2 rounded-md overflow-x-auto mt-1 text-xs">
                        <code>{JSON.stringify({
                          status: "shipped",
                          tracking_number: "123456789",
                          shipping_provider: "DHL"
                        }, null, 2)}</code>
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="prescriptions">
                  <AccordionTrigger>Rezepte</AccordionTrigger>
                  <AccordionContent className="space-y-4">
                    <div>
                      <h4 className="font-medium">GET /prescriptions</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Liefert eine Liste aller Rezepte, die Ihrer Apotheke zugewiesen wurden.
                      </p>
                    </div>
                    
                    <div className="pt-2">
                      <h4 className="font-medium">PATCH /prescriptions/{"{prescription_id}"}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Aktualisiert den Status eines Rezepts (z.B. zur Bestätigung der Einlösung).
                      </p>
                    </div>
                    
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Der Umgang mit Rezeptdaten unterliegt besonders strengen DSGVO-Anforderungen. 
                        Stellen Sie sicher, dass alle Zugriffe auf diese Daten ausreichend protokolliert werden.
                      </AlertDescription>
                    </Alert>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            
            <TabsContent value="auth" className="space-y-4">
              <h3 className="text-lg font-medium">Authentifizierung</h3>
              <p>
                Alle API-Anfragen benötigen einen gültigen API-Schlüssel, der im Header 
                "Authorization" übergeben wird.
              </p>
              <pre className="bg-muted p-2 rounded-md overflow-x-auto mt-2">
                <code>Authorization: Bearer sk_live_pharmacy_YOUR_API_KEY</code>
              </pre>
              
              <div className="mt-4">
                <h4 className="text-md font-medium">API-Schlüssel generieren</h4>
                <p className="mt-1">
                  Sie können einen API-Schlüssel in Ihrem Apotheken-Dashboard unter 
                  "Integrationen" &gt; "API" generieren.
                </p>
              </div>
              
              <div className="mt-4">
                <h4 className="text-md font-medium">Sicherheitshinweise</h4>
                <ul className="list-disc pl-5 mt-1">
                  <li>Bewahren Sie Ihren API-Schlüssel sicher auf und teilen Sie ihn nicht mit unbefugten Personen</li>
                  <li>Rotieren Sie Ihren API-Schlüssel regelmäßig</li>
                  <li>Verwenden Sie spezifische Schlüssel für verschiedene Integrationen</li>
                  <li>Überwachen Sie die Nutzung Ihres API-Schlüssels</li>
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="gdpr" className="space-y-4">
              <h3 className="text-lg font-medium">DSGVO-Konformität</h3>
              <p>
                Bei der Nutzung der API müssen Sie sicherstellen, dass Sie die Anforderungen 
                der Datenschutz-Grundverordnung (DSGVO) einhalten.
              </p>
              
              <div className="mt-4">
                <h4 className="text-md font-medium">Datenschutzmaßnahmen</h4>
                <ul className="list-disc pl-5 mt-1">
                  <li>Verwenden Sie die API nur für legitime Geschäftszwecke</li>
                  <li>Verarbeiten Sie nur die Daten, die Sie tatsächlich benötigen</li>
                  <li>Speichern Sie keine sensiblen Daten länger als notwendig</li>
                  <li>Stellen Sie sicher, dass Ihre Systeme entsprechend geschützt sind</li>
                  <li>Implementieren Sie die Rechte der betroffenen Personen (Auskunft, Löschung, etc.)</li>
                </ul>
              </div>
              
              <div className="mt-4">
                <h4 className="text-md font-medium">Technische Maßnahmen</h4>
                <ul className="list-disc pl-5 mt-1">
                  <li>Alle API-Kommunikation erfolgt über TLS/SSL</li>
                  <li>API-Schlüssel sollten sicher aufbewahrt werden</li>
                  <li>Protokollieren Sie Zugriffe auf personenbezogene Daten</li>
                  <li>Implementieren Sie geeignete Zugriffskontrollen</li>
                </ul>
              </div>
              
              <Alert className="mt-4">
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  Als Datenverarbeiter sind Sie mitverantwortlich für die Einhaltung der DSGVO. 
                  Stellen Sie sicher, dass Sie alle notwendigen Maßnahmen ergreifen, um die Sicherheit 
                  und Vertraulichkeit der Daten zu gewährleisten.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Integrationsleitfaden</CardTitle>
          <CardDescription>
            Schritt-für-Schritt-Anleitungen für die Integration verschiedener Systeme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="pharmacy-systems">
              <AccordionTrigger>Apothekensysteme</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <h4 className="font-medium">LAUER-FISCHER (WINAPO)</h4>
                  <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm">
                    <li>Öffnen Sie WINAPO und navigieren Sie zu "Einstellungen" &gt; "Schnittstellen"</li>
                    <li>Aktivieren Sie die REST-API-Schnittstelle</li>
                    <li>Notieren Sie sich die API-URL und den API-Schlüssel</li>
                    <li>Geben Sie diese Informationen in unserer Plattform unter "Integrationen" &gt; "Apothekensysteme" ein</li>
                    <li>Konfigurieren Sie die Synchronisationseinstellungen</li>
                    <li>Testen Sie die Verbindung mit dem "Verbindung testen" Button</li>
                  </ol>
                </div>
                
                <div className="pt-2">
                  <h4 className="font-medium">Pharmatechnik (IXOS)</h4>
                  <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm">
                    <li>Kontaktieren Sie Ihren Pharmatechnik-Support für die Aktivierung der API</li>
                    <li>Installieren Sie das IXOS-Connector-Modul</li>
                    <li>Konfigurieren Sie die Zugriffsrechte in der IXOS-Administration</li>
                    <li>Notieren Sie sich die Zugangsdaten</li>
                    <li>Geben Sie diese Informationen in unserer Plattform unter "Integrationen" &gt; "Apothekensysteme" ein</li>
                  </ol>
                </div>
                
                <div className="pt-2">
                  <h4 className="font-medium">awinta (PROKAS)</h4>
                  <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm">
                    <li>Öffnen Sie PROKAS und navigieren Sie zu "Verwaltung" &gt; "Schnittstellen"</li>
                    <li>Aktivieren Sie die "Externe Systeme" Schnittstelle</li>
                    <li>Generieren Sie einen API-Schlüssel</li>
                    <li>Geben Sie diese Informationen in unserer Plattform unter "Integrationen" &gt; "Apothekensysteme" ein</li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="ecommerce">
              <AccordionTrigger>E-Commerce-Plattformen</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <h4 className="font-medium">Shopify</h4>
                  <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm">
                    <li>Melden Sie sich in Ihrem Shopify-Admin an</li>
                    <li>Navigieren Sie zu "Apps" &gt; "App-Entwicklung" &gt; "Private Apps erstellen"</li>
                    <li>Erstellen Sie eine neue private App mit den erforderlichen Berechtigungen</li>
                    <li>Kopieren Sie den API-Zugangsschlüssel</li>
                    <li>Geben Sie diese Informationen in unserer Plattform unter "Integrationen" &gt; "E-Commerce" ein</li>
                  </ol>
                </div>
                
                <div className="pt-2">
                  <h4 className="font-medium">WooCommerce</h4>
                  <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm">
                    <li>Gehen Sie zu Ihrem WordPress-Dashboard</li>
                    <li>Navigieren Sie zu WooCommerce &gt; Einstellungen &gt; Erweitert &gt; REST API</li>
                    <li>Erstellen Sie einen neuen API-Schlüssel mit "Lesen/Schreiben" Berechtigungen</li>
                    <li>Kopieren Sie den Consumer Key und das Consumer Secret</li>
                    <li>Geben Sie diese Informationen in unserer Plattform unter "Integrationen" &gt; "E-Commerce" ein</li>
                  </ol>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="webhooks">
              <AccordionTrigger>Webhooks einrichten</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <p>
                  Mit Webhooks können Sie Echtzeit-Benachrichtigungen über Ereignisse in Ihrem Konto erhalten.
                </p>
                
                <div className="mt-2">
                  <h4 className="font-medium">Verfügbare Ereignisse</h4>
                  <ul className="list-disc pl-5 mt-1 text-sm">
                    <li><code>order.created</code> - Eine neue Bestellung wurde erstellt</li>
                    <li><code>order.updated</code> - Eine Bestellung wurde aktualisiert</li>
                    <li><code>product.created</code> - Ein neues Produkt wurde erstellt</li>
                    <li><code>product.updated</code> - Ein Produkt wurde aktualisiert</li>
                    <li><code>prescription.received</code> - Ein neues Rezept wurde empfangen</li>
                  </ul>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium">Einrichtung</h4>
                  <ol className="list-decimal pl-5 mt-1 text-sm">
                    <li>Navigieren Sie zu "Integrationen" &gt; "API" &gt; "Webhooks"</li>
                    <li>Klicken Sie auf "Webhook hinzufügen"</li>
                    <li>Geben Sie die URL ein, an die Benachrichtigungen gesendet werden sollen</li>
                    <li>Wählen Sie die Ereignisse aus, für die Sie Benachrichtigungen erhalten möchten</li>
                    <li>Speichern Sie die Konfiguration</li>
                  </ol>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium">Sicherheit</h4>
                  <p className="text-sm mt-1">
                    Alle Webhook-Anfragen enthalten einen <code>X-Webhook-Signature</code>-Header, den Sie 
                    verwenden sollten, um die Authentizität der Anfrage zu überprüfen. Die Signatur wird mit 
                    HMAC-SHA256 unter Verwendung Ihres Webhook-Geheimnisses erstellt.
                  </p>
                  <pre className="bg-muted p-2 rounded-md overflow-x-auto mt-2 text-xs">
                    <code>
                      {`const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(digest),
    Buffer.from(signature)
  );
}`}
                    </code>
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentationTab;
