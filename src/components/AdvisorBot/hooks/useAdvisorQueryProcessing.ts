
import { AdvisorState } from "../types";
import { detectToolIntent, processQuery } from "../utils";
import { executeN8nActions, sendToN8nWebhook } from "../utils/n8nIntegration";
import { products } from "@/data/products";

// Create a simplified product knowledge base for n8n
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
    console.log("Using fallback processing for query:", userQuery);
    
    const toolIntent = detectToolIntent(userQuery);
    
    if (toolIntent) {
      const { tool, params } = toolIntent;
      if (tools.webTools[tool]) {
        const toolResponse = tools.webTools[tool](params);
        
        const botResponseText = `${toolResponse}`;
        setters.setBotResponse(botResponseText);
        setters.setConversationHistory(prev => [...prev, { role: 'assistant', content: botResponseText }]);
        
        handleSpeakResponse(botResponseText);
      } else {
        console.error(`Tool ${tool} not found`);
        const errorResponse = "Entschuldigung, ich konnte diese Aktion nicht ausführen.";
        setters.setBotResponse(errorResponse);
        setters.setConversationHistory(prev => [...prev, { role: 'assistant', content: errorResponse }]);
        handleSpeakResponse(errorResponse);
      }
    } else {
      const response = processQuery(userQuery, setters.setRecommendedProducts, setters.setShowProducts);
      
      setters.setBotResponse(response);
      setters.setConversationHistory(prev => [...prev, { role: 'assistant', content: response }]);
      
      handleSpeakResponse(response);
    }
  };

  const processUserQuery = async (userQuery: string) => {
    if (userQuery.trim() === "") {
      console.log("Empty query, ignoring");
      return;
    }
    
    if (state.isLoading) {
      console.log("Already processing a query, ignoring");
      return;
    }
    
    console.log("Processing user query:", userQuery);
    setters.setIsLoading(true);
    setters.setTranscript(userQuery);
    
    try {
      if (state.isPlaying && advisorState.refs.conversation.status === "connected") {
        advisorState.refs.conversation.endSession();
        setters.setIsPlaying(false);
      }

      // Add user message to conversation history first
      setters.setConversationHistory(prev => [...prev, { role: 'user', content: userQuery }]);
      
      // Check if n8n integration is enabled and configured
      console.log("N8n configuration status for query processing:", {
        useN8nAgent: state.useN8nAgent,
        webhookUrl: state.webhookUrl,
        isVoice: state.isSpeechInputActive
      });
      
      if (state.useN8nAgent && state.webhookUrl && state.webhookUrl.trim() !== '') {
        console.log("Using n8n agent for processing query");
        
        try {
          // Force debugging output to help troubleshoot
          console.log(`Attempting to send request to webhook: ${state.webhookUrl}`);
          console.log(`useN8nAgent setting: ${state.useN8nAgent}`);
          
          // Send the request with a timeout
          const n8nResponse = await Promise.race([
            sendToN8nWebhook(
              userQuery, 
              state.webhookUrl, 
              state.useN8nAgent, 
              state.conversationHistory, 
              productKnowledgeBase,
              setters.setIsLoading,
              tools.toast
            ),
            // Add a timeout protection
            new Promise<null>((resolve) => {
              setTimeout(() => {
                console.log("N8n request timed out after 10 seconds");
                resolve(null);
              }, 10000); 
            })
          ]);
          
          // If we got a response from n8n, use it
          if (n8nResponse) {
            console.log("Successfully received n8n response:", n8nResponse);
            
            const { botResponse: n8nMessage, products: n8nProducts, actions } = n8nResponse;
            
            // Set the bot response
            setters.setBotResponse(n8nMessage);
            setters.setConversationHistory(prev => [...prev, { role: 'assistant', content: n8nMessage }]);
            
            // Process any product recommendations
            if (n8nProducts && n8nProducts.length > 0) {
              console.log("Displaying product recommendations from n8n:", n8nProducts);
              
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
            
            // Execute any actions returned by n8n
            executeN8nActions(actions, tools.navigate, tools.toast, setters.setIsOpen);
            
            // Speak the response if voice is enabled
            handleSpeakResponse(n8nMessage);
            
            console.log("n8n processing complete");
            return; // Exit early, we've handled the response
          } else {
            console.log("No valid response from n8n, falling back to local processing");
            tools.toast({
              title: "Keine Antwort vom n8n-Agenten",
              description: "Der n8n-Agent konnte keine Antwort liefern. Verwende lokale Verarbeitung.",
              variant: "destructive",
            });
            fallbackProcessing(userQuery);
          }
        } catch (n8nError) {
          console.error("Error processing with n8n:", n8nError);
          tools.toast({
            title: "N8N Fehler",
            description: "Es gab ein Problem mit der N8N-Integration. Verwende lokale Verarbeitung.",
            variant: "destructive",
          });
          fallbackProcessing(userQuery);
        }
      } else {
        console.log("N8n agent not enabled or webhook URL not set, using local processing");
        console.log("n8n config:", { useN8nAgent: state.useN8nAgent, webhookUrl: state.webhookUrl });
        fallbackProcessing(userQuery);
      }
      
      // Clear transcript after processing
      setTimeout(() => {
        setters.setTranscript("");
      }, 2000);
      
    } catch (error) {
      console.error("Error processing message:", error);
      const errorMessage = "Entschuldigung, ich konnte deine Anfrage nicht verarbeiten. Bitte versuche es später noch einmal.";
      setters.setBotResponse(errorMessage);
      setters.setConversationHistory(prev => [...prev, { role: 'assistant', content: errorMessage }]);
      handleSpeakResponse(errorMessage);
    } finally {
      setters.setIsLoading(false);
    }
  };

  return {
    processUserQuery
  };
};
