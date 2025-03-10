
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
  const { handleSpeakResponse, toggleVoice, toggleListening } = useAdvisorVoiceHandling(advisorState);
  const { processUserQuery } = useAdvisorQueryProcessing(advisorState, handleSpeakResponse);
  const { toggleAdvisor, handleSendMessage, handleKeyPress, handleNavigate } = 
    useAdvisorInteractions(advisorState, handleSpeakResponse);
  
  // Add processUserQuery to tools
  advisorState.tools.processUserQuery = processUserQuery;

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
    handleNavigate,
    gdprNotice
  };
};
