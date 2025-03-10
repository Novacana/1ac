
import { stopListening, startListening } from "../speechRecognition";
import { speakResponse } from "../voiceUtils";
import { AdvisorState } from "../types";

export const useAdvisorVoice = (advisorState: AdvisorState) => {
  const { 
    state, 
    setters, 
    refs, 
    tools 
  } = advisorState;
  
  const { toast } = tools;

  const toggleVoice = () => {
    // Wenn Sprachausgabe deaktiviert wird
    if (state.isVoiceEnabled) {
      // Aktuellen Ton stoppen, wenn er läuft
      if (state.isPlaying && refs.conversation.status === "connected") {
        refs.conversation.endSession();
        setters.setIsPlaying(false);
      }
    }
    setters.setIsVoiceEnabled(!state.isVoiceEnabled);
  };

  const toggleListening = () => {
    // DSGVO-Zustimmung prüfen
    if (!state.gdprConsent) {
      toast({
        title: "DSGVO-Zustimmung erforderlich",
        description: "Bitte stimme der Verarbeitung deiner Sprachdaten zu, bevor du die Spracherkennung nutzt.",
        variant: "destructive",
      });
      return;
    }
    
    if (state.isListening) {
      stopListening(refs.recognitionRef, setters.setIsListening);
    } else {
      startListening(
        setters.setIsListening,
        setters.setTranscript,
        processUserQuery,
        refs.recognitionRef,
        toast
      );
    }
  };

  const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newConsent = e.target.checked;
    setters.setGdprConsent(newConsent);
    localStorage.setItem('advisorBotGdprConsent', newConsent.toString());
  };

  // Import this function to avoid circular dependencies
  const { processUserQuery } = require('./useAdvisorProcessing');

  return {
    toggleVoice,
    toggleListening,
    handleConsentChange
  };
};
