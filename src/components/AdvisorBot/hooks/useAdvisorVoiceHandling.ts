
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
      // Make sure we have the processUserQuery function
      if (!tools.processUserQuery) {
        console.error("processUserQuery is not defined");
        tools.toast({
          title: "Fehler",
          description: "Sprachverarbeitung ist nicht verfügbar.",
          variant: "destructive"
        });
        return;
      }
      
      console.log("Starting listening with n8n config:", {
        useN8nAgent: state.useN8nAgent,
        webhookUrl: state.webhookUrl,
        isFullConversationMode: state.isFullConversationMode
      });
      
      startListening(
        setters.setIsListening,
        setters.setTranscript,
        tools.processUserQuery,
        refs.recognitionRef,
        tools.toast,
        state.isFullConversationMode
      );
    }
  };

  const stopSpeaking = () => {
    if (state.isPlaying && refs.conversation.status === "connected") {
      refs.conversation.endSession();
      setters.setIsPlaying(false);
    }
  };

  const handleSpeakResponse = (response: string) => {
    console.log("Handling speak response with voice enabled:", state.isVoiceEnabled);
    
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
    stopSpeaking,
    handleSpeakResponse
  };
};
