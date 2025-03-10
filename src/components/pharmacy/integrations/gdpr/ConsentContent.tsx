
import React from "react";

const ConsentContent: React.FC = () => {
  return (
    <div className="space-y-4 my-4 text-sm">
      <p>
        Gemäß der Datenschutz-Grundverordnung (DSGVO) benötigen wir Ihre ausdrückliche Einwilligung, bevor wir Daten mit externen Diensten austauschen.
      </p>
      
      <div className="space-y-2">
        <h4 className="font-medium">Diese Integration wird:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Produktdaten zwischen unserem System und dem externen Dienst synchronisieren</li>
          <li>Bestandsinformationen in Echtzeit abgleichen</li>
          <li>Preisänderungen automatisch aktualisieren</li>
          <li>Produktbeschreibungen und Bilder synchronisieren</li>
        </ul>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">Datenverarbeitung:</h4>
        <ul className="list-disc pl-5 space-y-1">
          <li>Alle Daten werden in Übereinstimmung mit der DSGVO verarbeitet</li>
          <li>Sie haben jederzeit das Recht, Ihre Einwilligung zu widerrufen</li>
          <li>Bei Widerruf werden keine weiteren Daten übertragen</li>
          <li>Bereits übertragene Daten müssen separat beim Drittanbieter gelöscht werden</li>
        </ul>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Sie können diese Einwilligung jederzeit in den Einstellungen widerrufen. Bitte lesen Sie unsere vollständige Datenschutzerklärung für weitere Informationen.
      </p>
    </div>
  );
};

export default ConsentContent;
