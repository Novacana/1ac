
import { useEffect } from "react";
import { AdvisorState } from "../types";
import { stopListening } from "../speechRecognition";
import { useAdvisorGdpr } from "./useAdvisorGdpr";
import { useAdvisorVoiceHandling } from "./useAdvisorVoiceHandling";
import { useAdvisorQueryProcessing } from "./useAdvisorQueryProcessing"; 
import { useAdvisorInteractions } from "./useAdvisorInteractions";

export const useAdvisor = (advisorState: AdvisorState) => {
  const { state, refs } = advisorState;
  
  // Initialize sub-hooks
  const { gdprNotice } = useAdvisorGdpr(advisorState);
  const { handleSpeakResponse, toggleVoice, toggleListening, stopSpeaking } = useAdvisorVoiceHandling(advisorState);
  const { processUserQuery } = useAdvisorQueryProcessing(advisorState, handleSpeakResponse);
  const { toggleAdvisor, handleSendMessage, handleKeyPress, handleNavigate } = 
    useAdvisorInteractions(advisorState, handleSpeakResponse);
  
  // Make sure processUserQuery is available in tools
  advisorState.tools.processUserQuery = processUserQuery;

  // Log initial n8n configuration
  useEffect(() => {
    console.log("useAdvisor initialized with n8n config:", {
      webhookUrl: state.webhookUrl,
      useN8nAgent: state.useN8nAgent
    });
  }, [state.webhookUrl, state.useN8nAgent]);

  // Auto-scroll effect
  useEffect(() => {
    if (refs.messagesRef.current && refs.bottomRef.current && state.isOpen) {
      refs.bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.conversationHistory, state.isOpen, refs.bottomRef, refs.messagesRef]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      if (refs.recognitionRef.current) {
        stopListening(refs.recognitionRef, advisorState.setters.setIsListening);
      }
      
      if (refs.conversation.status === "connected") {
        refs.conversation.endSession();
      }
    };
  }, [refs.conversation, refs.recognitionRef, advisorState.setters.setIsListening]);

  return {
    processUserQuery,
    toggleAdvisor,
    handleSendMessage,
    handleKeyPress,
    toggleVoice,
    toggleListening,
    stopSpeaking,
    handleNavigate,
    gdprNotice
  };
};
