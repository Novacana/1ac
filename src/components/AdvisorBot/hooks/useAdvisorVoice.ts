
import { startListening, stopListening } from "../speechRecognition";
import { AdvisorState } from "../types";
import { speakResponse } from "../voiceUtils";

export const useAdvisorVoice = (advisorState: AdvisorState) => {
  const { state, setters, refs, tools } = advisorState;
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
      setters.setShowGdprNotice(true);
      return;
    }
    
    if (state.isListening) {
      stopListening(refs.recognitionRef, setters.setIsListening);
    } else {
      startListening(
        setters.setIsListening,
        setters.setTranscript,
        (query) => {}, // This will be set in useAdvisorInteractions
        refs.recognitionRef,
        toast
      );
    }
  };

  const handleConsentChange = () => {
    setters.setGdprConsent(true);
    localStorage.setItem('advisorBotGdprConsent', 'true');
    setters.setShowGdprNotice(false);
    
    toast({
      title: "DSGVO-Zustimmung erteilt",
      description: "Vielen Dank für Ihre Zustimmung. Sie können jetzt die Spracherkennung nutzen.",
    });
  };

  const handleDismissGdprNotice = () => {
    setters.setShowGdprNotice(false);
  };

  const handleSpeakResponse = (text: string) => {
    if (state.isVoiceEnabled && state.gdprConsent) {
      speakResponse(
        text,
        state.isVoiceEnabled,
        state.isApiKeySet,
        refs.conversation,
        setters.setIsPlaying,
        state.isPlaying,
        toast
      );
    }
  };

  return {
    toggleVoice,
    toggleListening,
    handleConsentChange,
    handleDismissGdprNotice,
    handleSpeakResponse
  };
};
