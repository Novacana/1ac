
import React from "react";

interface GDPRConsentNoticeProps {
  gdprConsent: boolean;
  handleConsentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// DSGVO-Hinweis für die Spracherkennung und Sprachausgabe
const gdprNotice = `
Dieser Bot nutzt Spracherkennung und Sprachausgabe. 
Ihre Sprachdaten werden für die Dauer der Konversation gespeichert und verwendet, 
um Ihre Anfragen zu bearbeiten. Die Daten werden nicht für andere Zwecke verwendet 
und nach Beendigung der Sitzung gelöscht.
`;

const GDPRConsentNotice: React.FC<GDPRConsentNoticeProps> = ({
  gdprConsent,
  handleConsentChange
}) => {
  return (
    <div className="border rounded-md p-3 bg-primary/10 text-sm">
      <h4 className="font-medium mb-2">DSGVO-Hinweis</h4>
      <p className="text-xs mb-3">{gdprNotice}</p>
      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="gdprConsent" 
          checked={gdprConsent} 
          onChange={handleConsentChange}
        />
        <label htmlFor="gdprConsent" className="text-xs">
          Ich stimme der Verarbeitung meiner Sprachdaten zu
        </label>
      </div>
    </div>
  );
};

export default GDPRConsentNotice;
