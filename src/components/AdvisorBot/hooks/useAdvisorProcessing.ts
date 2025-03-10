
import {
  processQuery,
  detectToolIntent,
  executeN8nActions,
  sendToN8nWebhook
} from "../utils";
import { createWebTools } from "../utils/webTools";
import { AdvisorState, Message } from "../types";
import { useToast } from "@/hooks/use-toast";

export const useAdvisorProcessing = (advisorState: AdvisorState) => {
  const { 
    state: { 
      userInput, 
      isLoading, 
      conversationHistory, 
      webhookUrl, 
      useN8nAgent, 
      isVoiceEnabled, 
      gdprConsent, 
      isApiKeySet, 
      isPlaying 
    },
    setters: { 
      setIsLoading, 
      setTranscript, 
      setConversationHistory, 
      setBotResponse, 
      setRecommendedProducts, 
      setShowProducts, 
      setIsPlaying 
    },
    refs: { conversation },
    tools: { toast, navigate, webTools }
  } = advisorState;

  // Process user's query and generate a response
  const processUserQuery = async (userQuery: string) => {
    if (userQuery.trim() === "" || isLoading) return;
    
    setIsLoading(true);
    setTranscript(userQuery);
    
    try {
      // Stoppe laufende Sprachausgabe
      if (isPlaying && conversation.status === "connected") {
        conversation.endSession();
        setIsPlaying(false);
      }

      // Add user query to conversation history
      setConversationHistory(prev => [...prev, { role: 'user', content: userQuery }]);
      
      if (useN8nAgent && webhookUrl) {
        try {
          const n8nResponse = await sendToN8nWebhook(
            userQuery, 
            webhookUrl, 
            useN8nAgent, 
            conversationHistory, 
            [], // productKnowledgeBase would go here
            setIsLoading,
            toast
          );
          
          if (n8nResponse) {
            const { botResponse: n8nMessage, products: n8nProducts, actions } = n8nResponse;
            
            setBotResponse(n8nMessage);
            setConversationHistory(prev => [...prev, { role: 'assistant', content: n8nMessage }]);
            
            if (n8nProducts && n8nProducts.length > 0) {
              setRecommendedProducts(n8nProducts);
              setShowProducts(n8nProducts.length > 0);
            } else {
              setShowProducts(false);
              setRecommendedProducts([]);
            }
            
            executeN8nActions(actions, navigate, toast, setIsPlaying);
            
            if (isVoiceEnabled && gdprConsent) {
              // Speak response function would be called here
            }
          } else {
            fallbackProcessing(userQuery);
          }
        } catch (n8nError) {
          console.error("N8n webhook error:", n8nError);
          fallbackProcessing(userQuery);
        }
      } else {
        fallbackProcessing(userQuery);
      }
      
      // Reset transcript after short delay
      setTimeout(() => {
        setTranscript("");
      }, 2000);
      
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage = "Entschuldigung, ich konnte deine Anfrage nicht verarbeiten. Bitte versuche es später noch einmal.";
      setBotResponse(errorMessage);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback processing for when n8n is not available or fails
  const fallbackProcessing = (userQuery: string) => {
    const toolIntent = detectToolIntent(userQuery);
    
    if (toolIntent) {
      const { tool, params } = toolIntent;
      const toolResponse = webTools[tool](params);
      
      const botResponseText = `${toolResponse}`;
      setBotResponse(botResponseText);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: botResponseText }]);
      
    } else {
      const response = processQuery(userQuery, setRecommendedProducts, setShowProducts);
      
      setBotResponse(response);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: response }]);
    }
  };

  return {
    processUserQuery,
    fallbackProcessing
  };
};
