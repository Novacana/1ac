
import { useState, useRef, useEffect } from "react";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ProductDetailProps } from "@/components/ProductDetail";
import { useConversation } from "@11labs/react";
import AdvisorBotHeader from "./AdvisorBotHeader";
import ConversationHistory from "./ConversationHistory";
import UserInputArea from "./UserInputArea";
import { createWebTools, detectToolIntent, processQuery } from "./toolUtils";
import { ELEVENLABS_API_KEY } from "./voiceUtils";
import { Message } from "./types";

// LLM Context für bessere Empfehlungen
const systemPrompt = `
Du bist ein Berater für medizinisches Cannabis. Dein Zweck ist es, Menschen zu helfen, 
die idealen Cannabis-Produkte für ihre individuellen Bedürfnisse zu finden.

Du hast folgende Funktionen:
1. Du kannst Produkte empfehlen, die zu den Symptomen, Wünschen oder Beschwerden des Nutzers passen.
2. Du kannst Fragen zu Cannabis, seinen Wirkungen und medizinischen Anwendungen beantworten.
3. Du kannst dem Nutzer helfen, sich durch die Website zu navigieren.

Verwende die folgenden Tools, um dem Nutzer zu helfen:
- navigateToPage: Navigiere zu einer bestimmten Seite der Website.
- searchProducts: Suche nach Produkten basierend auf Stichworten oder Eigenschaften.
- addToCart: Füge ein Produkt zum Warenkorb hinzu.
- showProductDetails: Zeige Details zu einem bestimmten Produkt.

Deine Antworten sollten knapp, freundlich und informativ sein. Vermeide lange Einleitungen.
`;

const ProductAdvisor = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [userInput, setUserInput] = useState("");
  const [botResponse, setBotResponse] = useState("Hallo! Ich bin dein persönlicher Berater für medizinisches Cannabis. Wie kann ich dir heute helfen?");
  const [isPlaying, setIsPlaying] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductDetailProps[]>([]);
  const [showProducts, setShowProducts] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {role: 'assistant', content: "Hallo! Ich bin dein persönlicher Berater für medizinisches Cannabis. Wie kann ich dir heute helfen?"}
  ]);
  
  // Wir speichern den API-Schlüssel direkt und überspringen den Eingabebildschirm
  const elevenLabsApiKey = ELEVENLABS_API_KEY;
  const isApiKeySet = true;
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // ElevenLabs Voice Settings
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

  const webTools = createWebTools(navigate, toast);

  useEffect(() => {
    // Cleanup function for speech services
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      // End ElevenLabs conversation if active
      if (conversation.status === "connected") {
        conversation.endSession();
      }
    };
  }, [conversation]);

  const toggleAdvisor = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      // Stop all audio if closing the advisor
      if (conversation.status === "connected") {
        conversation.endSession();
        setIsPlaying(false);
      }
      if (isListening) {
        stopListening();
      }
    }
  };

  const speakResponse = async (text: string) => {
    if (!isVoiceEnabled || !isApiKeySet) return;
    
    try {
      if (isPlaying) {
        if (conversation.status === "connected") {
          conversation.endSession();
        }
        setIsPlaying(false);
        return;
      }

      setIsPlaying(true);
      
      // Use ElevenLabs for voice synthesis
      const options = {
        overrides: {
          tts: {
            voiceId: "XB0fDUnXU5powFXDhCwa", // Charlotte - German voice
          },
          agent: {
            language: "de",
          }
        }
      };
      
      // Simulate ElevenLabs response for this demo
      // In a real implementation, you would use the actual agent
      conversation.startSession({
        url: `https://api.elevenlabs.io/v1/text-to-speech/XB0fDUnXU5powFXDhCwa`,
        headers: {
          'xi-api-key': elevenLabsApiKey,
          'Content-Type': 'application/json',
        },
        ...options
      }).then(() => {
        setTimeout(() => {
          setIsPlaying(false);
        }, text.length * 80); // Approximate duration based on text length
      }).catch(error => {
        console.error("Error with ElevenLabs:", error);
        setIsPlaying(false);
        toast({
          title: "Fehler bei der Sprachausgabe",
          description: "Die ElevenLabs Sprachausgabe konnte nicht gestartet werden.",
          variant: "destructive",
        });
      });
      
    } catch (error) {
      console.error("Error generating speech:", error);
      toast({
        title: "Fehler bei der Sprachausgabe",
        description: "Ein Fehler ist bei der Sprachausgabe aufgetreten.",
        variant: "destructive",
      });
      setIsPlaying(false);
    }
  };

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled);
    if (isPlaying) {
      if (conversation.status === "connected") {
        conversation.endSession();
      }
      setIsPlaying(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Spracherkennung nicht unterstützt",
        description: "Dein Browser unterstützt keine Spracherkennung. Bitte verwende Chrome, Edge oder Safari.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'de-DE';
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
      toast({
        title: "Spracherkennung aktiv",
        description: "Du kannst jetzt sprechen.",
      });
    };
    
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
          processUserQuery(finalTranscript);
        } else {
          interimTranscript += transcript;
          // Display interim results in real-time
          setTranscript(interimTranscript);
        }
      }
    };
    
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      stopListening();
      toast({
        title: "Fehler bei der Spracherkennung",
        description: `Fehler: ${event.error}`,
        variant: "destructive",
      });
    };
    
    recognition.onend = () => {
      if (isListening) {
        // Restart if it ends unexpectedly while still in listening mode
        recognition.start();
      }
    };
    
    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSendMessage = () => {
    if (userInput.trim()) {
      processUserQuery(userInput);
      setUserInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNavigate = (path: string) => {
    const response = webTools.navigateToPage(path);
    setBotResponse(response);
    setConversationHistory(prev => [...prev, { role: 'assistant', content: response }]);
    
    if (isVoiceEnabled) {
      speakResponse(response);
    }
  };

  const processUserQuery = async (userQuery: string) => {
    if (userQuery.trim() === "" || isLoading) return;
    
    setIsLoading(true);
    setTranscript(userQuery); // Display the final transcript

    try {
      // If bot is currently speaking, stop it
      if (isPlaying && conversation.status === "connected") {
        conversation.endSession();
        setIsPlaying(false);
      }

      // Add user message to conversation history
      setConversationHistory(prev => [...prev, { role: 'user', content: userQuery }]);
      
      // Check if the user query implies using a tool
      const toolIntent = detectToolIntent(userQuery);
      
      if (toolIntent) {
        // Use the detected tool
        const { tool, params } = toolIntent;
        const toolResponse = webTools[tool](params);
        
        // Add tool response to conversation
        const botResponseText = `${toolResponse}`;
        setBotResponse(botResponseText);
        setConversationHistory(prev => [...prev, { role: 'assistant', content: botResponseText }]);
        
        // Generate speech for the response if voice is enabled
        if (isVoiceEnabled) {
          speakResponse(botResponseText);
        }
      } else {
        // Process with LLM algorithm
        const response = processQuery(userQuery, setRecommendedProducts, setShowProducts);
        
        setBotResponse(response);
        
        // Add bot response to conversation history
        setConversationHistory(prev => [...prev, { role: 'assistant', content: response }]);
        
        // Generate speech for the response if voice is enabled
        if (isVoiceEnabled) {
          speakResponse(response);
        }
      }
      
      // Clear transcript after processing
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

  return (
    <>
      <Button
        onClick={toggleAdvisor}
        className={cn(
          "fixed bottom-4 right-4 rounded-full shadow-lg z-50 transition-all duration-300",
          isOpen ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
        )}
        size="icon"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </Button>

      <div
        className={cn(
          "fixed bottom-20 right-4 w-80 md:w-96 z-[100] transition-all duration-300 transform",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
        )}
      >
        <Card className="border shadow-lg overflow-hidden flex flex-col h-[600px]">
          <AdvisorBotHeader 
            isVoiceEnabled={isVoiceEnabled}
            toggleVoice={toggleVoice}
            toggleAdvisor={toggleAdvisor}
          />

          <ConversationHistory
            conversationHistory={conversationHistory}
            isPlaying={isPlaying}
            transcript={transcript}
            isLoading={isLoading}
            recommendedProducts={recommendedProducts}
            showProducts={showProducts}
            onActionClick={processUserQuery}
            onNavigate={handleNavigate}
            onProductClick={() => setIsOpen(false)}
          />

          <UserInputArea
            userInput={userInput}
            setUserInput={setUserInput}
            handleSendMessage={handleSendMessage}
            handleKeyPress={handleKeyPress}
            isLoading={isLoading}
            isListening={isListening}
            toggleListening={toggleListening}
            isVoiceEnabled={isVoiceEnabled}
            toggleVoice={toggleVoice}
          />
        </Card>
      </div>
    </>
  );
};

export default ProductAdvisor;
