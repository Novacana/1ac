
import { startListening, stopListening } from "../speechRecognition";
import { speakResponse } from "../voiceUtils";
import { AdvisorState } from "../types";

export const useAdvisorVoice = (advisorState: AdvisorState) => {
  const { 
    state: { 
      isVoiceEnabled, 
      isListening, 
      gdprConsent, 
      botResponse, 
      isPlaying, 
      isApiKeySet 
    },
    setters: { 
      setIsVoiceEnabled, 
      setIsListening, 
      setShowGdprNotice, 
      setIsPlaying 
    },
    refs: { 
      recognitionRef, 
      conversation 
    },
    tools: { 
      toast, 
      processUserQuery 
    }
  } = advisorState;
  
  // Toggle voice enabled/disabled
  const toggleVoice = () => {
    if (isVoiceEnabled) {
      if (isPlaying && conversation.status === "connected") {
        conversation.endSession();
        setIsPlaying(false);
      }
    }
    setIsVoiceEnabled(!isVoiceEnabled);
  };
  
  // Toggle listening state (speech recognition)
  const toggleListening = () => {
    if (!gdprConsent) {
      setShowGdprNotice(true);
      return;
    }
    
    if (isListening) {
      stopListening(recognitionRef, setIsListening);
    } else {
      startListening(
        setIsListening,
        advisorState.setters.setTranscript,
        processUserQuery,
        recognitionRef,
        toast
      );
    }
  };
  
  // Speak the current bot response
  const speakBotResponse = () => {
    if (isVoiceEnabled && gdprConsent && botResponse) {
      speakResponse(
        botResponse,
        isVoiceEnabled,
        isApiKeySet,
        conversation,
        setIsPlaying,
        isPlaying,
        toast
      );
    }
  };
  
  return {
    toggleVoice,
    toggleListening,
    speakBotResponse
  };
};
