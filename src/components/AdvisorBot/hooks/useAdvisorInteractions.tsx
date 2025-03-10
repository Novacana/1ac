
import { useEffect } from 'react';
import { useAdvisorCore } from './useAdvisorCore';
import { useAdvisorProcessing } from './useAdvisorProcessing';
import { useAdvisorVoice } from './useAdvisorVoice';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useConversation } from '@11labs/react';

export const useAdvisorInteractions = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const conversation = useConversation({
    onError: (error) => {
      console.error("ElevenLabs error:", error);
      toast({
        title: "Fehler bei der Sprachausgabe",
        description: "Es gab ein Problem mit der ElevenLabs Sprachausgabe.",
        variant: "destructive",
      });
    }
  });

  // Create the advisor core state and utilities
  const advisorState = useAdvisorCore(toast, navigate, conversation);
  
  // Get processing functions
  const { processUserQuery, fallbackProcessing } = useAdvisorProcessing(advisorState);
  
  // Get voice handling functions
  const {
    toggleVoice,
    toggleListening,
    handleConsentChange,
    handleDismissGdprNotice,
    handleSpeakResponse
  } = useAdvisorVoice(advisorState);
  
  // Setup the processQuery function in the voice handler
  const startListeningWithProcessing = () => {
    if (!advisorState.state.gdprConsent) {
      advisorState.setters.setShowGdprNotice(true);
      return;
    }
    
    // Update the startListening function to use our processUserQuery
    if (advisorState.state.isListening) {
      // Import and use stopListening directly to avoid circular dependencies
      const { stopListening } = require('../speechRecognition');
      stopListening(advisorState.refs.recognitionRef, advisorState.setters.setIsListening);
    } else {
      // Import and use startListening directly to avoid circular dependencies
      const { startListening } = require('../speechRecognition');
      startListening(
        advisorState.setters.setIsListening,
        advisorState.setters.setTranscript,
        processUserQuery,
        advisorState.refs.recognitionRef,
        toast
      );
    }
  };
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (advisorState.state.userInput.trim()) {
      processUserQuery(advisorState.state.userInput);
      advisorState.setters.setUserInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    if (advisorState.refs.messagesRef.current && advisorState.refs.bottomRef.current && advisorState.state.isOpen) {
      advisorState.refs.bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [advisorState.state.conversationHistory, advisorState.state.isOpen]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (advisorState.refs.recognitionRef.current) {
        // Import and use stopListening directly to avoid circular dependencies
        const { stopListening } = require('../speechRecognition');
        stopListening(advisorState.refs.recognitionRef, advisorState.setters.setIsListening);
      }
      
      if (conversation.status === "connected") {
        conversation.endSession();
      }
    };
  }, []);

  return {
    state: advisorState.state,
    setters: advisorState.setters,
    refs: advisorState.refs,
    processUserQuery,
    fallbackProcessing,
    toggleVoice,
    toggleListening: startListeningWithProcessing,
    handleConsentChange,
    handleDismissGdprNotice,
    handleSendMessage,
    handleKeyPress,
    handleSpeakResponse
  };
};
