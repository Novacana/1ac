
import { useEffect } from "react";
import { AdvisorState } from "../types";
import { speakResponse } from "../voiceUtils";
import { startListening, stopListening } from "../speechRecognition";
import { 
  detectToolIntent, 
  processQuery, 
  executeN8nActions, 
  sendToN8nWebhook 
} from "../utils";
import { products } from "@/data/products";

// DSGVO-Hinweis für die Spracherkennung und Sprachausgabe
export const gdprNotice = `
Dieser Bot nutzt Spracherkennung und Sprachausgabe. 
Ihre Sprachdaten werden für die Dauer der Konversation gespeichert und verwendet, 
um Ihre Anfragen zu bearbeiten. Die Daten werden nicht für andere Zwecke verwendet 
und nach Beendigung der Sitzung gelöscht.
`;

const productKnowledgeBase = products.map(p => ({
  id: p.id,
  name: p.name,
  category: p.category,
  strain: p.strain,
  effects: p.effects,
  benefits: p.benefits,
  thcContent: p.thc,
  cbdContent: p.cbd,
  terpenes: p.terpenes,
  flavors: p.flavors
}));

export const useAdvisor = (advisorState: AdvisorState) => {
  const { state, setters, refs, tools } = advisorState;

  // Add processUserQuery to tools
  const processUserQuery = async (userQuery: string) => {
    if (userQuery.trim() === "" || state.isLoading) return;
    
    setters.setIsLoading(true);
    setters.setTranscript(userQuery);
    
    try {
      if (state.isPlaying && refs.conversation.status === "connected") {
        refs.conversation.endSession();
        setters.setIsPlaying(false);
      }

      setters.setConversationHistory(prev => [...prev, { role: 'user', content: userQuery }]);
      
      if (state.useN8nAgent && state.webhookUrl) {
        try {
          const n8nResponse = await sendToN8nWebhook(
            userQuery, 
            state.webhookUrl, 
            state.useN8nAgent, 
            state.conversationHistory, 
            productKnowledgeBase,
            setters.setIsLoading,
            tools.toast
          );
          
          if (n8nResponse) {
            const { botResponse: n8nMessage, products: n8nProducts, actions } = n8nResponse;
            
            setters.setBotResponse(n8nMessage);
            setters.setConversationHistory(prev => [...prev, { role: 'assistant', content: n8nMessage }]);
            
            if (n8nProducts && n8nProducts.length > 0) {
              const formattedProducts = n8nProducts.map((p: any) => {
                const localProduct = products.find(lp => lp.id === p.id || lp.name === p.name);
                
                if (localProduct) return localProduct;
                
                return {
                  id: p.id || "unknown",
                  name: p.name || "Unbekanntes Produkt",
                  price: p.price || 0,
                  images: p.images || ["/placeholder.svg"],
                  category: p.category || "Sonstiges"
                };
              });
              
              setters.setRecommendedProducts(formattedProducts);
              setters.setShowProducts(formattedProducts.length > 0);
            } else {
              setters.setShowProducts(false);
              setters.setRecommendedProducts([]);
            }
            
            executeN8nActions(actions, tools.navigate, tools.toast, setters.setIsOpen);
            
            if (state.isVoiceEnabled && state.gdprConsent) {
              speakResponse(n8nMessage, state.isVoiceEnabled, state.isApiKeySet, refs.conversation, setters.setIsPlaying, state.isPlaying, tools.toast);
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
      
      setTimeout(() => {
        setters.setTranscript("");
      }, 2000);
      
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage = "Entschuldigung, ich konnte deine Anfrage nicht verarbeiten. Bitte versuche es später noch einmal.";
      setters.setBotResponse(errorMessage);
      setters.setConversationHistory(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setters.setIsLoading(false);
    }
  };

  // Fallback processing logic
  const fallbackProcessing = (userQuery: string) => {
    const toolIntent = detectToolIntent(userQuery);
    
    if (toolIntent) {
      const { tool, params } = toolIntent;
      const toolResponse = tools.webTools[tool](params);
      
      const botResponseText = `${toolResponse}`;
      setters.setBotResponse(botResponseText);
      setters.setConversationHistory(prev => [...prev, { role: 'assistant', content: botResponseText }]);
      
      if (state.isVoiceEnabled && state.gdprConsent) {
        speakResponse(botResponseText, state.isVoiceEnabled, state.isApiKeySet, refs.conversation, setters.setIsPlaying, state.isPlaying, tools.toast);
      }
    } else {
      const response = processQuery(userQuery, setters.setRecommendedProducts, setters.setShowProducts);
      
      setters.setBotResponse(response);
      setters.setConversationHistory(prev => [...prev, { role: 'assistant', content: response }]);
      
      if (state.isVoiceEnabled && state.gdprConsent) {
        speakResponse(response, state.isVoiceEnabled, state.isApiKeySet, refs.conversation, setters.setIsPlaying, state.isPlaying, tools.toast);
      }
    }
  };

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
        stopListening(refs.recognitionRef, setters.setIsListening);
      }
      
      if (refs.conversation.status === "connected") {
        refs.conversation.endSession();
      }
    };
  }, [refs.conversation, refs.recognitionRef, setters.setIsListening]);

  // Interaction handlers
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
    if (!state.gdprConsent) {
      setters.setShowGdprNotice(true);
      return;
    }
    
    if (state.isListening) {
      stopListening(refs.recognitionRef, setters.setIsListening);
    } else {
      startListening(
        setters.setIsListening,
        setters.setTranscript,
        processUserQuery,
        refs.recognitionRef,
        tools.toast
      );
    }
  };

  const handleNavigate = (path: string) => {
    const response = tools.webTools.navigateToPage(path);
    setters.setBotResponse(response);
    setters.setConversationHistory(prev => [...prev, { role: 'assistant', content: response }]);
    
    if (state.isVoiceEnabled && state.gdprConsent) {
      speakResponse(response, state.isVoiceEnabled, state.isApiKeySet, refs.conversation, setters.setIsPlaying, state.isPlaying, tools.toast);
    }
  };

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
