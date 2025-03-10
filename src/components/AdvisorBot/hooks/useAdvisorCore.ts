
import { useToast } from "@/hooks/use-toast";
import { AdvisorState } from "../types";
import { speakResponse } from "../voiceUtils";
import { stopListening } from "../speechRecognition";

export const useAdvisorCore = (advisorState: AdvisorState) => {
  const { 
    state, 
    setters, 
    refs, 
    tools 
  } = advisorState;
  
  const { toast } = tools;

  const toggleAdvisor = () => {
    setters.setIsOpen(!state.isOpen);
    if (state.isOpen) {
      if (refs.conversation.status === "connected") {
        refs.conversation.endSession();
        setters.setIsPlaying(false);
      }
      if (state.isListening) {
        stopListening(refs.recognitionRef, setters.setIsListening);
      }
    }
  };

  const handleSendMessage = () => {
    if (state.userInput.trim()) {
      processUserQuery(state.userInput);
      setters.setUserInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNavigate = (path: string) => {
    const response = tools.webTools.navigateToPage(path);
    setters.setBotResponse(response);
    setters.setConversationHistory(prev => [...prev, { role: 'assistant', content: response }]);
    
    if (state.isVoiceEnabled && state.gdprConsent) {
      speakResponse(
        response, 
        state.isVoiceEnabled, 
        state.isApiKeySet, 
        refs.conversation, 
        setters.setIsPlaying, 
        state.isPlaying, 
        toast
      );
    }
  };

  // Import processUserQuery function to avoid circular dependencies
  const { processUserQuery } = require('./useAdvisorProcessing');

  return {
    toggleAdvisor,
    handleSendMessage,
    handleKeyPress,
    handleNavigate
  };
};
