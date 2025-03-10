
import { speakResponse } from "../voiceUtils";
import { AdvisorState, Message } from "../types";
import { startListening, stopListening } from "../speechRecognition";
import { toast as toastFunction } from "@/hooks/use-toast";

export const useAdvisorVoice = (advisorState: AdvisorState) => {
  const { 
    state: { 
      isVoiceEnabled, 
      isListening, 
      gdprConsent, 
      isApiKeySet,
      isPlaying,
      botResponse 
    },
    setters: { 
      setIsListening, 
      setIsVoiceEnabled,
      setTranscript,
      setShowGdprNotice,
      setIsPlaying
    },
    refs: { 
      recognitionRef,
      conversation 
    },
    tools: { toast }
  } = advisorState;

  const toggleVoice = () => {
    // Stop current audio if playing
    if (isVoiceEnabled) {
      if (isPlaying && conversation.status === "connected") {
        conversation.endSession();
        setIsPlaying(false);
      }
    }
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  const toggleListening = () => {
    // Check GDPR consent
    if (!gdprConsent) {
      setShowGdprNotice(true);
      return;
    }
    
    if (isListening) {
      stopListening(recognitionRef, setIsListening);
    } else {
      // Use the advisorState.tools.processUserQuery conditionally 
      if (advisorState.tools.processUserQuery) {
        startListening(
          setIsListening,
          setTranscript,
          advisorState.tools.processUserQuery,
          recognitionRef,
          toastFunction // Use the imported toast function directly
        );
      } else {
        // Handle the case where processUserQuery is not defined
        toastFunction({
          title: "Fehler",
          description: "Sprachverarbeitung ist derzeit nicht verfügbar.",
          variant: "destructive"
        });
      }
    }
  };

  const speakBotResponse = async () => {
    if (!isVoiceEnabled || !gdprConsent || !isApiKeySet || !botResponse) return;
    
    await speakResponse(
      botResponse,
      isVoiceEnabled,
      isApiKeySet,
      conversation,
      setIsPlaying,
      isPlaying,
      toastFunction // Use the imported toast function directly
    );
  };

  return {
    toggleVoice,
    toggleListening,
    speakBotResponse
  };
};
