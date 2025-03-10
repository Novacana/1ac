
import { useState, useEffect } from 'react';
import { useAdvisorCore } from './useAdvisorCore';
import { useAdvisorProcessing } from './useAdvisorProcessing';
import { useAdvisorVoice } from './useAdvisorVoice';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useConversation } from '@11labs/react';
import { AdvisorState, ToastFunction } from '../types';

export const useAdvisorInteractions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Initialize the core state and utilities
  const coreState = useAdvisorCore(navigate, toast, useConversation);
  
  // Add showGdprNotice to the state if it's missing
  const [showGdprNotice, setShowGdprNotice] = useState(false);
  
  // Create a complete advisorState that matches the AdvisorState type
  const advisorState: AdvisorState = {
    ...coreState,
    state: {
      ...coreState.state,
      showGdprNotice
    },
    setters: {
      ...coreState.setters,
      setShowGdprNotice
    }
  };
  
  // Get processing utilities (for handling user queries)
  const { processUserQuery } = useAdvisorProcessing(advisorState);
  
  // Add processUserQuery to the tools object
  const toolsWithProcessQuery: AdvisorState['tools'] = {
    ...advisorState.tools,
    processUserQuery
  };
  
  // Update the tools object with the processUserQuery function
  advisorState.tools = toolsWithProcessQuery;
  
  // Get voice interaction utilities
  const { toggleVoice, toggleListening, speakBotResponse } = useAdvisorVoice(advisorState);
  
  // Handle sending messages
  const handleSendMessage = () => {
    if (advisorState.state.userInput.trim()) {
      if (processUserQuery) {
        processUserQuery(advisorState.state.userInput);
      } else {
        advisorState.tools.toast({
          title: "Fehler",
          description: "Die Verarbeitung von Nachrichten ist derzeit nicht verfügbar.",
          variant: "destructive"
        });
      }
      advisorState.setters.setUserInput("");
    }
  };
  
  // Handle keyboard input (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle GDPR consent
  const handleConsentChange = () => {
    advisorState.setters.setGdprConsent(true);
    localStorage.setItem('advisorBotGdprConsent', 'true');
    advisorState.setters.setShowGdprNotice(false);
    
    advisorState.tools.toast({
      title: "DSGVO-Zustimmung erteilt",
      description: "Vielen Dank für Ihre Zustimmung. Sie können jetzt die Spracherkennung nutzen.",
    });
  };
  
  // Handle closing the GDPR notice
  const handleDismissGdprNotice = () => {
    advisorState.setters.setShowGdprNotice(false);
  };
  
  // Handle navigation
  const handleNavigate = (path: string) => {
    const response = advisorState.tools.webTools.navigateToPage(path);
    advisorState.setters.setBotResponse(response);
    advisorState.setters.setConversationHistory(prev => [...prev, { role: 'assistant', content: response }]);
    
    if (advisorState.state.isVoiceEnabled && advisorState.state.gdprConsent) {
      speakBotResponse();
    }
  };
  
  // Speak the response when it changes
  useEffect(() => {
    if (advisorState.state.botResponse && advisorState.state.isVoiceEnabled && 
        advisorState.state.gdprConsent && !advisorState.state.isLoading) {
      speakBotResponse();
    }
  }, [advisorState.state.botResponse, advisorState.state.isLoading]);
  
  // Toggle the advisor panel
  const toggleAdvisor = () => {
    advisorState.setters.setIsOpen(!advisorState.state.isOpen);
    if (advisorState.state.isOpen) {
      if (advisorState.refs.conversation.status === "connected") {
        advisorState.refs.conversation.endSession();
        advisorState.setters.setIsPlaying(false);
      }
      if (advisorState.state.isListening) {
        toggleListening();
      }
    }
  };
  
  return {
    ...advisorState,
    handleSendMessage,
    handleKeyPress,
    handleConsentChange,
    handleDismissGdprNotice,
    handleNavigate,
    toggleAdvisor,
    toggleVoice,
    toggleListening
  };
};
