
import { speakResponse } from "../voiceUtils";
import { AdvisorState, Message } from "../types";
import { startListening, stopListening } from "../speechRecognition";

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
      startListening(
        setIsListening,
        setTranscript,
        advisorState.tools.processUserQuery,
        recognitionRef,
        toast
      );
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
      toast
    );
  };

  return {
    toggleVoice,
    toggleListening,
    speakBotResponse
  };
};
