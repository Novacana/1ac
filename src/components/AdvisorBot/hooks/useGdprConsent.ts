
import { useEffect } from "react";
import { AdvisorState } from "../types";

export const useGdprConsent = (advisorState: AdvisorState) => {
  const { state, setters, tools } = advisorState;
  
  useEffect(() => {
    const savedConsent = localStorage.getItem('advisorBotGdprConsent');
    if (savedConsent === 'true') {
      setters.setGdprConsent(true);
    }
  }, [setters]);

  const handleConsentChange = () => {
    setters.setGdprConsent(true);
    localStorage.setItem('advisorBotGdprConsent', 'true');
    setters.setShowGdprNotice(false);
    
    tools.toast({
      title: "DSGVO-Zustimmung erteilt",
      description: "Vielen Dank für Ihre Zustimmung. Sie können jetzt die Spracherkennung nutzen.",
    });
  };

  const handleDismissGdprNotice = () => {
    setters.setShowGdprNotice(false);
  };

  return {
    handleConsentChange,
    handleDismissGdprNotice
  };
};
