
import React, { useState } from "react";
import Layout from "@/components/Layout";
import WooCommerceConfig from "@/components/admin/WooCommerceConfig";
import ShopifyConfig from "@/components/admin/ShopifyConfig";
import PartnerConfig from "@/components/admin/PartnerConfig";
import PaymentConfig from "@/components/admin/PaymentConfig";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const AdminConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState("partners");

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Link to="/">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Zurück zum Shop
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Shop-Konfiguration</h1>
            <p className="text-muted-foreground mt-2">
              Konfigurieren Sie Ihre Shop-Integrationen, Partner und Zahlungseinstellungen.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
            <TabsList className="mb-4">
              <TabsTrigger value="partners">Partner</TabsTrigger>
              <TabsTrigger value="payments">Zahlungen</TabsTrigger>
              <TabsTrigger value="woocommerce">WooCommerce</TabsTrigger>
              <TabsTrigger value="shopify">Shopify</TabsTrigger>
            </TabsList>
            
            <TabsContent value="partners">
              <PartnerConfig />
            </TabsContent>

            <TabsContent value="payments">
              <PaymentConfig />
            </TabsContent>
            
            <TabsContent value="woocommerce">
              <WooCommerceConfig />
              
              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <h3 className="text-lg font-medium text-amber-800 mb-2">WooCommerce Setup Guide</h3>
                <div className="text-sm text-amber-700 space-y-2">
                  <p>So richten Sie die WooCommerce-Integration ein:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Melden Sie sich im WordPress-Admin-Dashboard an</li>
                    <li>Navigieren Sie zu WooCommerce &gt; Einstellungen &gt; Erweitert &gt; REST API</li>
                    <li>Klicken Sie auf "Schlüssel hinzufügen"</li>
                    <li>
                      Geben Sie eine Beschreibung ein (z.B. "Cannabis Store App"), setzen Sie die Berechtigungen auf "Lesen",
                      und klicken Sie auf "API-Schlüssel generieren"
                    </li>
                    <li>Kopieren Sie den Consumer Key und das Consumer Secret</li>
                    <li>Fügen Sie diese in das Konfigurationsformular oben ein</li>
                    <li>Geben Sie Ihre WordPress-Site-URL ein</li>
                    <li>Klicken Sie auf "Konfiguration speichern" und dann auf "Verbindung testen"</li>
                  </ol>
                  
                  <p className="mt-4">
                    <strong>Wichtig:</strong> Stellen Sie sicher, dass Ihre WooCommerce-Produkte die folgenden
                    benutzerdefinierten Felder eingerichtet haben, um mit dieser App richtig zu funktionieren:
                  </p>
                  
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>thc_content</strong>: THC-Prozentsatz (z.B. "18%" oder "15-20%")
                    </li>
                    <li>
                      <strong>cbd_content</strong>: CBD-Prozentsatz (z.B. "0,2%" oder "&lt;0,2%")
                    </li>
                    <li>
                      <strong>strain_type</strong>: Der Stammtyp (z.B. "Indica", "Sativa" oder "Hybrid")
                    </li>
                    <li>
                      <strong>effects</strong>: Eine durch Kommas getrennte Liste oder JSON-Array von Effekten
                    </li>
                    <li>
                      <strong>flavors</strong>: Eine durch Kommas getrennte Liste oder JSON-Array von Aromen
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="shopify">
              <ShopifyConfig />
              
              <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-md">
                <h3 className="text-lg font-medium text-amber-800 mb-2">Shopify Setup Guide</h3>
                <div className="text-sm text-amber-700 space-y-2">
                  <p>So richten Sie die Shopify-Integration ein:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Melden Sie sich in Ihrem Shopify-Admin-Dashboard an</li>
                    <li>Navigieren Sie zu Apps &gt; App-Entwicklung &gt; Private Apps erstellen</li>
                    <li>Klicken Sie auf "Private App erstellen"</li>
                    <li>
                      Geben Sie einen Namen für Ihre App ein (z.B. "Cannabis Store Integration")
                    </li>
                    <li>Unter "Admin API", setzen Sie die Berechtigungen für "Products" auf "Read"</li>
                    <li>Klicken Sie auf "Speichern" und dann auf "App erstellen"</li>
                    <li>Kopieren Sie den API-Access-Token</li>
                    <li>
                      Geben Sie Ihren Shop-Namen (z.B. "your-store-name" ohne .myshopify.com) und den 
                      Access Token in das Formular oben ein
                    </li>
                    <li>Klicken Sie auf "Konfiguration speichern" und dann auf "Verbindung testen"</li>
                  </ol>
                  
                  <p className="mt-4">
                    <strong>Wichtig:</strong> Für die optimale Integration sollten Sie Ihre Shopify-Produkte
                    mit den folgenden Tags versehen:
                  </p>
                  
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <strong>thc:18%</strong>: Für den THC-Gehalt
                    </li>
                    <li>
                      <strong>cbd:0.2%</strong>: Für den CBD-Gehalt
                    </li>
                    <li>
                      <strong>strain:Indica</strong>: Für den Stammtyp
                    </li>
                    <li>
                      <strong>effect:Entspannend</strong>: Für Produkteffekte (mehrere Tags möglich)
                    </li>
                    <li>
                      <strong>flavor:Zitrus</strong>: Für Produktaromen (mehrere Tags möglich)
                    </li>
                    <li>
                      <strong>lab-tested</strong>: Für labortestierte Produkte
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default AdminConfig;
