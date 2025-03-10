
import { AdvisorState } from "../types";

// GDPR notice for speech recognition and speech output
export const gdprNotice = `
Dieser Bot nutzt Spracherkennung und Sprachausgabe. 
Ihre Sprachdaten werden für die Dauer der Konversation gespeichert und verwendet, 
um Ihre Anfragen zu bearbeiten. Die Daten werden nicht für andere Zwecke verwendet 
und nach Beendigung der Sitzung gelöscht.
`;

export const useAdvisorGdpr = (advisorState: AdvisorState) => {
  const { state, setters } = advisorState;

  const handleGdprConsent = (consent: boolean) => {
    setters.setGdprConsent(consent);
    setters.setShowGdprNotice(false);
  };

  const showGdprNoticeIfNeeded = () => {
    if (!state.gdprConsent) {
      setters.setShowGdprNotice(true);
      return true;
    }
    return false;
  };

  return {
    gdprNotice,
    handleGdprConsent,
    showGdprNoticeIfNeeded
  };
};
