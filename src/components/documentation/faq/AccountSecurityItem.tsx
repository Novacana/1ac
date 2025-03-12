
import React from "react";
import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Shield, KeyRound, Smartphone, History } from "lucide-react";

const AccountSecurityItem: React.FC = () => {
  return (
    <AccordionItem value="item-1">
      <AccordionTrigger>Wie sichere ich mein Konto?</AccordionTrigger>
      <AccordionContent className="space-y-4">
        <h3 className="font-medium flex items-center gap-2">
          <KeyRound className="h-4 w-4" />
          Starkes Passwort erstellen
        </h3>
        <p>
          Ein sicheres Passwort sollte:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Mindestens 12 Zeichen lang sein</li>
          <li>Groß- und Kleinbuchstaben enthalten</li>
          <li>Zahlen und Sonderzeichen enthalten</li>
          <li>Nicht in anderen Diensten wiederverwendet werden</li>
        </ul>
        <p>
          Sie können Ihr Passwort in den <Link to="/settings" className="text-primary underline">Kontoeinstellungen</Link> unter dem Menüpunkt <span className="font-medium">Sicherheit</span> ändern.
        </p>
        
        <h3 className="font-medium mt-2 flex items-center gap-2">
          <Smartphone className="h-4 w-4" />
          Zwei-Faktor-Authentifizierung aktivieren
        </h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            Gehen Sie zu <Link to="/settings" className="text-primary underline">Kontoeinstellungen</Link> {'>'} <span className="font-medium">Sicherheit</span> {'>'} <span className="font-medium">Zwei-Faktor-Authentifizierung</span>
          </li>
          <li>
            Klicken Sie auf <span className="font-medium">Aktivieren</span>
          </li>
          <li>
            Wählen Sie Ihre bevorzugte Methode:
            <ul className="list-disc pl-5 mt-1">
              <li>Authentificator-App (empfohlen)</li>
              <li>SMS-Code</li>
              <li>E-Mail-Code</li>
            </ul>
          </li>
          <li>
            Folgen Sie den Anweisungen auf dem Bildschirm, um die Einrichtung abzuschließen
          </li>
        </ol>
        
        <h3 className="font-medium mt-2 flex items-center gap-2">
          <History className="h-4 w-4" />
          Regelmäßige Sicherheitsüberprüfungen
        </h3>
        <p>
          Überprüfen Sie regelmäßig Ihre <Link to="/settings/security-log" className="text-primary underline">Anmeldeaktivitäten</Link>, um ungewöhnliche Zugriffsversuche zu erkennen. Bei verdächtigen Aktivitäten:
        </p>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Ändern Sie sofort Ihr Passwort</li>
          <li>Überprüfen Sie die verknüpften Geräte und entfernen Sie unbekannte Geräte</li>
          <li>Kontaktieren Sie den <Link to="/support" className="text-primary underline">Support</Link>, wenn Sie Hilfe benötigen</li>
        </ol>
        
        <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-100 dark:border-blue-900">
          <h3 className="font-medium flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <Shield className="h-4 w-4" />
            DSGVO-Hinweis
          </h3>
          <p className="text-sm mt-1 text-blue-700 dark:text-blue-400">
            Alle Sicherheitsmaßnahmen entsprechen den Anforderungen der Datenschutz-Grundverordnung (DSGVO) 
            und dem Health Insurance Portability and Accountability Act (HIPAA). Ihre Daten werden 
            entsprechend den höchsten Sicherheitsstandards geschützt.
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default AccountSecurityItem;
