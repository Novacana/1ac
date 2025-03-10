
import { speakResponse } from "../voiceUtils";
import { startListening, stopListening } from "../speechRecognition";
import { AdvisorState } from "../types";

export const useAdvisorVoiceHandling = (advisorState: AdvisorState) => {
  const { state, setters, refs, tools } = advisorState;

  const toggleVoice = () => {
    if (state.isVoiceEnabled) {
      if (state.isPlaying && refs.conversation.status === "connected") {
        refs.conversation.endSession();
        setters.setIsPlaying(false);
      }
    }
    setters.setIsVoiceEnabled(!state.isVoiceEnabled);
  };

  const toggleListening = () => {
    // If no GDPR consent, show notice and return
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
        tools.processUserQuery,
        refs.recognitionRef,
        tools.toast
      );
    }
  };

  const handleSpeakResponse = (response: string) => {
    if (state.isVoiceEnabled && state.gdprConsent) {
      speakResponse(
        response, 
        state.isVoiceEnabled, 
        state.isApiKeySet, 
        refs.conversation, 
        setters.setIsPlaying, 
        state.isPlaying, 
        tools.toast
      );
    }
  };

  return {
    toggleVoice,
    toggleListening,
    handleSpeakResponse
  };
};
