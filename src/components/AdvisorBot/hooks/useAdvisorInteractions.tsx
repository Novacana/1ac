
import { useAdvisorCore } from './useAdvisorCore';
import { useAdvisorVoice } from './useAdvisorVoice';
import { useAdvisorProcessing } from './useAdvisorProcessing';

export const useAdvisorInteractions = (advisorState: any) => {
  const core = useAdvisorCore(advisorState);
  const voice = useAdvisorVoice(advisorState);
  const processing = useAdvisorProcessing(advisorState);
  
  // Create a reference to the processUserQuery function for other modules to use
  // This resolves the circular dependency issue
  (require('./useAdvisorProcessing')).processUserQuery = processing.processUserQuery;
  
  return {
    // Core interactions
    toggleAdvisor: core.toggleAdvisor,
    handleSendMessage: core.handleSendMessage,
    handleKeyPress: core.handleKeyPress,
    handleNavigate: core.handleNavigate,
    
    // Voice interactions
    toggleVoice: voice.toggleVoice,
    toggleListening: voice.toggleListening,
    handleConsentChange: voice.handleConsentChange,
    
    // Query processing
    processUserQuery: processing.processUserQuery
  };
};
