
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

export const GDPRCookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem("gdpr-consent");
    if (!hasConsented) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("gdpr-consent", "true");
    setShowConsent(false);
  };

  const handleDecline = () => {
    // Set only necessary cookies
    localStorage.setItem("gdpr-consent", "minimal");
    setShowConsent(false);
  };

  return (
    <>
      {showConsent && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t border-border">
          <Card className="shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle>Datenschutzeinstellungen</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setShowConsent(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="text-sm">
              <p>
                Diese Website verwendet Cookies und ähnliche Technologien, um Ihr Browsing-Erlebnis zu verbessern und 
                personalisierte Inhalte anzubieten. Gemäß der DSGVO benötigen wir Ihre Einwilligung.
              </p>
              <div className="flex gap-2 mt-2">
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-sm"
                  onClick={() => setShowPrivacyPolicy(true)}
                >
                  Datenschutzerklärung anzeigen
                </Button>
                <span className="text-muted-foreground">oder</span>
                <Link to="/datenschutz" className="text-primary hover:underline text-sm">
                  vollständige Datenschutzrichtlinie
                </Link>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleDecline}>
                Nur notwendige
              </Button>
              <Button onClick={handleAccept}>
                Alle akzeptieren
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      <Dialog open={showPrivacyPolicy} onOpenChange={setShowPrivacyPolicy}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Datenschutzerklärung</DialogTitle>
            <DialogDescription>
              Informationen gemäß DSGVO (Datenschutz-Grundverordnung)
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Allgemein</TabsTrigger>
              <TabsTrigger value="cookies">Cookies</TabsTrigger>
              <TabsTrigger value="rights">Ihre Rechte</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4 mt-4 text-sm">
              <h3 className="font-medium text-lg">Allgemeine Informationen</h3>
              <p>
                Gemäß Artikel 13 und 14 der Datenschutz-Grundverordnung (DSGVO) sind wir verpflichtet, Sie über die Verarbeitung Ihrer personenbezogenen Daten zu informieren.
              </p>
              <p>
                <strong>Verantwortlich für die Datenverarbeitung:</strong><br />
                1A Cannabis GmbH<br />
                Musterstraße 123<br />
                12345 Musterstadt<br />
                Deutschland<br />
                E-Mail: datenschutz@1a-cannabis.de
              </p>
              <p>
                <strong>Datenschutzbeauftragter:</strong><br />
                Max Mustermann<br />
                E-Mail: dsb@1a-cannabis.de
              </p>
              <div className="mt-4">
                <Link to="/datenschutz" className="text-primary hover:underline">
                  Zur vollständigen Datenschutzrichtlinie
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="cookies" className="space-y-4 mt-4 text-sm">
              <h3 className="font-medium text-lg">Cookie-Richtlinie</h3>
              <p>
                Wir verwenden Cookies auf unserer Website. Cookies sind kleine Textdateien, die von Webservern auf Ihrem Endgerät gespeichert werden.
              </p>
              <h4 className="font-medium mt-3">Arten von Cookies, die wir verwenden:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Notwendige Cookies:</strong> Diese Cookies sind für die Funktionalität unserer Website erforderlich.</li>
                <li><strong>Präferenz-Cookies:</strong> Diese Cookies ermöglichen es unserer Website, Ihre Präferenzen (z.B. Spracheinstellungen) zu speichern.</li>
                <li><strong>Statistik-Cookies:</strong> Diese Cookies helfen uns zu verstehen, wie Besucher mit unserer Website interagieren.</li>
                <li><strong>Marketing-Cookies:</strong> Diese Cookies werden verwendet, um Besucher auf Websites zu verfolgen und relevante Werbung anzuzeigen.</li>
              </ul>
              <div className="mt-4">
                <Link to="/datenschutz" className="text-primary hover:underline">
                  Zur vollständigen Datenschutzrichtlinie
                </Link>
              </div>
            </TabsContent>
            
            <TabsContent value="rights" className="space-y-4 mt-4 text-sm">
              <h3 className="font-medium text-lg">Ihre Rechte</h3>
              <p>
                Nach der DSGVO haben Sie verschiedene Rechte bezüglich Ihrer personenbezogenen Daten:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Recht auf Auskunft (Art. 15 DSGVO):</strong> Sie haben das Recht zu erfahren, welche Daten wir über Sie gespeichert haben.</li>
                <li><strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie können verlangen, dass unrichtige Daten korrigiert werden.</li>
                <li><strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie können verlangen, dass Ihre Daten gelöscht werden.</li>
                <li><strong>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO):</strong> Sie können die Verarbeitung Ihrer Daten einschränken lassen.</li>
                <li><strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können Ihre Daten in einem strukturierten Format erhalten.</li>
                <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie können der Verarbeitung Ihrer Daten widersprechen.</li>
              </ul>
              <p className="mt-3">
                Sie haben außerdem das Recht, eine Beschwerde bei einer Aufsichtsbehörde einzureichen, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer Daten gegen die DSGVO verstößt.
              </p>
              <div className="mt-4">
                <Link to="/datenschutz" className="text-primary hover:underline">
                  Zur vollständigen Datenschutzrichtlinie
                </Link>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-4">
            <div className="flex items-center justify-between w-full">
              <Link to="/datenschutz" className="text-primary hover:underline text-sm">
                Vollständige Datenschutzrichtlinie öffnen
              </Link>
              <Button onClick={() => setShowPrivacyPolicy(false)}>
                Schließen
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GDPRCookieConsent;
