
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DocumentationCard: React.FC = () => {
  return (
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
            <TabsTrigger value="gdpr">DSGVO-Konformität</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <h3 className="text-lg font-medium">Einführung in die API</h3>
            <p>
              Unsere API ermöglicht es Ihnen, programmatisch auf Ihre Apothekendaten zuzugreifen 
              und die Integration mit anderen Systemen zu automatisieren.
            </p>
            <h4 className="text-md font-medium mt-4">Authentifizierung</h4>
            <p>
              Alle API-Anfragen benötigen einen gültigen API-Schlüssel, der im Header 
              "Authorization" übergeben wird.
            </p>
            <pre className="bg-muted p-2 rounded-md overflow-x-auto mt-2">
              <code>Authorization: Bearer sk_live_pharmacy_YOUR_API_KEY</code>
            </pre>
          </TabsContent>
          
          <TabsContent value="endpoints" className="space-y-4">
            <h3 className="text-lg font-medium">Verfügbare Endpunkte</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium">GET /api/pharmacy/products</h4>
                <p className="text-sm text-muted-foreground">
                  Liefert eine Liste aller Produkte in Ihrer Apotheke.
                </p>
              </div>
              <div>
                <h4 className="font-medium">POST /api/pharmacy/products</h4>
                <p className="text-sm text-muted-foreground">
                  Erstellt ein neues Produkt in Ihrer Apotheke.
                </p>
              </div>
              <div>
                <h4 className="font-medium">GET /api/pharmacy/orders</h4>
                <p className="text-sm text-muted-foreground">
                  Liefert eine Liste aller Bestellungen.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="gdpr" className="space-y-4">
            <h3 className="text-lg font-medium">DSGVO-Konformität</h3>
            <p>
              Bei der Nutzung der API müssen Sie sicherstellen, dass Sie die Anforderungen 
              der Datenschutz-Grundverordnung (DSGVO) einhalten.
            </p>
            
            <h4 className="text-md font-medium mt-4">Datenschutzmaßnahmen</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verwenden Sie die API nur für legitime Geschäftszwecke</li>
              <li>Verarbeiten Sie nur die Daten, die Sie tatsächlich benötigen</li>
              <li>Speichern Sie keine sensiblen Daten länger als notwendig</li>
              <li>Stellen Sie sicher, dass Ihre Systeme entsprechend geschützt sind</li>
              <li>Implementieren Sie die Rechte der betroffenen Personen (Auskunft, Löschung, etc.)</li>
            </ul>
            
            <h4 className="text-md font-medium mt-4">Technische Maßnahmen</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Alle API-Kommunikation erfolgt über TLS/SSL</li>
              <li>API-Schlüssel sollten sicher aufbewahrt werden</li>
              <li>Protokollieren Sie Zugriffe auf personenbezogene Daten</li>
              <li>Implementieren Sie geeignete Zugriffskontrollen</li>
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DocumentationCard;
