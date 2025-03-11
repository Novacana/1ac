
import { toast } from "@/hooks/use-toast";

// N8N API configuration
const N8N_API_BASE_URL = "https://n8n-tejkg.ondigitalocean.app/api/v1";
const N8N_WORKFLOW_ID = "50aea9a1-9064-49c7-aea6-3a8714b26157";

// Interface for the chat message
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Send a message to n8n workflow directly via the API
 * @param message The user's message
 * @param conversationHistory Previous messages for context
 * @returns The assistant's response message
 */
export async function sendMessageToN8N(
  message: string, 
  conversationHistory: ChatMessage[]
): Promise<string> {
  // Create the payload for n8n API
  const payload = {
    message,
    conversation_history: conversationHistory.slice(-5),
    user_info: {
      page: window.location.pathname,
      timestamp: new Date().toISOString()
    }
  };
  
  console.log("Sending to n8n API:", payload);
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    // Use direct API call instead of webhook
    const response = await fetch(`${N8N_API_BASE_URL}/workflows/${N8N_WORKFLOW_ID}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        // Add API key here if required by n8n
        // "X-N8N-API-KEY": "your-api-key"
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error ${response.status}:`, errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseText = await response.text();
    let botMessage: string;
    
    try {
      const responseData = JSON.parse(responseText);
      console.log("Response data:", responseData);
      
      // Handle n8n API response structure (which might be different from webhook response)
      if (responseData.data && responseData.data.execution) {
        // Try to find output from the last node
        const lastNodeOutput = 
          responseData.data.execution.data.resultData.runData?.[
            Object.keys(responseData.data.execution.data.resultData.runData).pop() || ""
          ]?.[0]?.data?.main?.[0];
          
        if (lastNodeOutput) {
          // Extract the result from the last node's output
          botMessage = lastNodeOutput.message || 
                       lastNodeOutput.response || 
                       lastNodeOutput.content || 
                       JSON.stringify(lastNodeOutput);
        } else {
          // If we can't find the output in the expected structure, return the raw data
          botMessage = JSON.stringify(responseData.data);
        }
      } else if (responseData.message || responseData.response || responseData.content) {
        // Direct response format
        botMessage = responseData.message || responseData.response || responseData.content;
      } else {
        // Fallback to stringified response
        botMessage = JSON.stringify(responseData);
      }
    } catch (e) {
      console.log("Response is not JSON, using as plain text:", responseText);
      botMessage = responseText;
    }
    
    if (!botMessage) {
      throw new Error("Invalid response format");
    }
    
    return botMessage;
  } catch (error) {
    console.error("Error sending message to n8n:", error);
    
    let errorMessage = "Es ist ein Fehler bei der Kommunikation aufgetreten.";
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = "Die Verbindung hat zu lange gedauert. Bitte versuche es erneut.";
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = "Konnte keine Verbindung zum Server herstellen. Bitte überprüfe deine Internetverbindung.";
      }
    }
    
    // Show the error toast
    toast({
      title: "Fehler",
      description: errorMessage,
      variant: "destructive"
    });
    
    throw new Error(errorMessage);
  }
}
