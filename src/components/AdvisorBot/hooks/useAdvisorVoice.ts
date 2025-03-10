
import { startListening, stopListening } from "../speechRecognition";
import { speakResponse } from "../voiceUtils";
import { AdvisorState } from "../types";
import { toast as toastFunction } from "@/hooks/use-toast";

export const useAdvisorVoice = (advisorState: AdvisorState) => {
  const {
    state: {
      isVoiceEnabled,
      isListening,
      isPlaying,
      botResponse,
      gdprConsent,
      isApiKeySet
    },
    setters: {
      setIsVoiceEnabled,
      setIsListening,
      setIsPlaying,
      setShowGdprNotice
    },
    refs: {
      recognitionRef,
      conversation
    },
    tools: {
      toast
    }
  } = advisorState;

  // Toggle voice functionality
  const toggleVoice = () => {
    if (isVoiceEnabled) {
      if (isPlaying && conversation.status === "connected") {
        conversation.endSession();
        setIsPlaying(false);
      }
      toast({
        title: "Sprachausgabe deaktiviert",
        description: "Die Sprachausgabe wurde deaktiviert.",
      });
    } else {
      toast({
        title: "Sprachausgabe aktiviert",
        description: "Die Sprachausgabe wurde aktiviert.",
      });
    }
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  // Toggle listening functionality
  const toggleListening = () => {
    if (!gdprConsent) {
      setShowGdprNotice(true);
      return;
    }
    
    if (isListening) {
      stopListening(recognitionRef, setIsListening);
    } else {
      if (advisorState.tools.processUserQuery) {
        startListening(
          setIsListening,
          advisorState.setters.setTranscript,
          advisorState.tools.processUserQuery,
          recognitionRef,
          toastFunction
        );
      } else {
        toast({
          title: "Spracherkennung nicht verfügbar",
          description: "Die Sprachverarbeitung ist derzeit nicht verfügbar.",
          variant: "destructive"
        });
      }
    }
  };

  // Speak the bot's response
  const speakBotResponse = () => {
    speakResponse(
      botResponse,
      isVoiceEnabled,
      isApiKeySet,
      conversation,
      setIsPlaying,
      isPlaying,
      toastFunction
    );
  };

  return {
    toggleVoice,
    toggleListening,
    speakBotResponse
  };
};
