
import { products } from "@/data/products";
import { speakResponse } from "../voiceUtils";
import { 
  detectToolIntent, 
  processQuery,
  executeN8nActions,
  sendToN8nWebhook
} from "../toolUtils";
import { AdvisorState, Message } from "../types";
import { Toast } from "@/hooks/use-toast";

export const useAdvisorProcessing = (advisorState: AdvisorState) => {
  const { 
    state, 
    setters, 
    refs, 
    tools 
  } = advisorState;
  
  const { toast, navigate } = tools;

  const fallbackProcessing = (userQuery: string) => {
    const toolIntent = detectToolIntent(userQuery);
    
    if (toolIntent) {
      const { tool, params } = toolIntent;
      const toolResponse = tools.webTools[tool](params);
      
      const botResponseText = `${toolResponse}`;
      setters.setBotResponse(botResponseText);
      setters.setConversationHistory(prev => [...prev, { role: 'assistant', content: botResponseText }]);
      
      if (state.isVoiceEnabled && state.gdprConsent) {
        speakResponse(
          botResponseText, 
          state.isVoiceEnabled, 
          state.isApiKeySet, 
          refs.conversation, 
          setters.setIsPlaying, 
          state.isPlaying, 
          toast
        );
      }
    } else {
      const response = processQuery(
        userQuery, 
        setters.setRecommendedProducts, 
        setters.setShowProducts
      );
      
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
    }
  };

  const processUserQuery = async (userQuery: string) => {
    if (userQuery.trim() === "" || state.isLoading) return;
    
    setters.setIsLoading(true);
    setters.setTranscript(userQuery);
    
    try {
      // Stoppe laufende Sprachausgabe
      if (state.isPlaying && refs.conversation.status === "connected") {
        refs.conversation.endSession();
        setters.setIsPlaying(false);
      }

      // Füge Benutzeranfrage zur Konversationshistorie hinzu
      setters.setConversationHistory(prev => [...prev, { role: 'user', content: userQuery }]);
      
      if (state.useN8nAgent && state.webhookUrl) {
        try {
          const n8nResponse = await sendToN8nWebhook(
            userQuery, 
            state.webhookUrl, 
            state.useN8nAgent, 
            state.conversationHistory, 
            products,
            setters.setIsLoading,
            toast
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
            
            executeN8nActions(actions, navigate, toast, setters.setIsOpen);
            
            if (state.isVoiceEnabled && state.gdprConsent) {
              speakResponse(
                n8nMessage, 
                state.isVoiceEnabled, 
                state.isApiKeySet, 
                refs.conversation, 
                setters.setIsPlaying, 
                state.isPlaying, 
                toast
              );
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
      
      // Zurücksetzen des Transkripts nach kurzer Verzögerung
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

  return {
    processUserQuery,
    fallbackProcessing
  };
};
