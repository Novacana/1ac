import { AdvisorState } from "../types";
import { stopListening } from "../speechRecognition";

export const useAdvisorInteractions = (
  advisorState: AdvisorState,
  handleSpeakResponse: (response: string) => void
) => {
  const { state, setters, refs, tools } = advisorState;

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
      tools.processUserQuery?.(state.userInput);
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
    
    handleSpeakResponse(response);
  };

  return {
    toggleAdvisor,
    handleSendMessage,
    handleKeyPress,
    handleNavigate
  };
};
