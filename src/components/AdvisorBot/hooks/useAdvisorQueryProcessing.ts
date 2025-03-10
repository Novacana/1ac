
import { AdvisorState } from "../types";
import { detectToolIntent, processQuery } from "../utils";
import { executeN8nActions, sendToN8nWebhook } from "../utils/n8nIntegration";
import { products } from "@/data/products";

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

export const useAdvisorQueryProcessing = (
  advisorState: AdvisorState,
  handleSpeakResponse: (response: string) => void
) => {
  const { state, setters, tools } = advisorState;

  // Fallback processing logic
  const fallbackProcessing = (userQuery: string) => {
    const toolIntent = detectToolIntent(userQuery);
    
    if (toolIntent) {
      const { tool, params } = toolIntent;
      const toolResponse = tools.webTools[tool](params);
      
      const botResponseText = `${toolResponse}`;
      setters.setBotResponse(botResponseText);
      setters.setConversationHistory(prev => [...prev, { role: 'assistant', content: botResponseText }]);
      
      handleSpeakResponse(botResponseText);
    } else {
      const response = processQuery(userQuery, setters.setRecommendedProducts, setters.setShowProducts);
      
      setters.setBotResponse(response);
      setters.setConversationHistory(prev => [...prev, { role: 'assistant', content: response }]);
      
      handleSpeakResponse(response);
    }
  };

  const processUserQuery = async (userQuery: string) => {
    if (userQuery.trim() === "" || state.isLoading) return;
    
    setters.setIsLoading(true);
    setters.setTranscript(userQuery);
    
    try {
      if (state.isPlaying && advisorState.refs.conversation.status === "connected") {
        advisorState.refs.conversation.endSession();
        setters.setIsPlaying(false);
      }

      setters.setConversationHistory(prev => [...prev, { role: 'user', content: userQuery }]);
      
      // Log all parameters being sent to n8n webhook
      console.log("Sending query to n8n:", {
        userQuery,
        webhookUrl: state.webhookUrl,
        useN8nAgent: state.useN8nAgent,
        conversationHistoryLength: state.conversationHistory.length
      });
      
      if (state.useN8nAgent && state.webhookUrl) {
        try {
          console.log("Attempting to communicate with n8n webhook at:", state.webhookUrl);
          
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
            console.log("Received n8n response:", n8nResponse);
            
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
            
            handleSpeakResponse(n8nMessage);
          } else {
            console.log("No response from n8n, using fallback processing");
            fallbackProcessing(userQuery);
          }
        } catch (n8nError) {
          console.error("N8n webhook error:", n8nError);
          tools.toast({
            title: "N8N Webhook Fehler",
            description: "Die Verbindung zum N8N Webhook konnte nicht hergestellt werden.",
            variant: "destructive",
          });
          fallbackProcessing(userQuery);
        }
      } else {
        console.log("N8n agent not used, using fallback processing");
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

  return {
    processUserQuery
  };
};
