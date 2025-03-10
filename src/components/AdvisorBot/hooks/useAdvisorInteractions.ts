
import { AdvisorState } from "../types";

export const useAdvisorInteractions = (
  advisorState: AdvisorState,
  handleSpeakResponse: (response: string) => void
) => {
  const { state, setters, tools } = advisorState;

  const toggleAdvisor = () => {
    setters.setIsOpen(!state.isOpen);
  };

  const handleSendMessage = async () => {
    if (!state.userInput.trim() || state.isLoading) return;

    const userMessage = state.userInput.trim();
    setters.setUserInput("");
    
    // Make sure processUserQuery exists before calling it
    if (typeof tools.processUserQuery === 'function') {
      await tools.processUserQuery(userMessage);
    } else {
      console.error("processUserQuery is not defined");
      tools.toast({
        title: "Fehler",
        description: "Die Anfrage konnte nicht verarbeitet werden.",
        variant: "destructive"
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNavigate = (path: string) => {
    tools.navigate(path);
    setters.setIsOpen(false);
  };

  // Helper function to toggle voice mode
  const toggleVoiceMode = () => {
    // If no GDPR consent, show notice and return
    if (!state.gdprConsent) {
      setters.setShowGdprNotice(true);
      return;
    }
    
    const newMode = !state.isSpeechInputActive;
    console.log("Toggling voice mode to:", newMode);
    setters.setIsSpeechInputActive(newMode);
  };

  return {
    toggleAdvisor,
    handleSendMessage,
    handleKeyPress,
    handleNavigate,
    toggleVoiceMode
  };
};

export default useAdvisorInteractions;
