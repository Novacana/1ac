
import { useState, useRef, useEffect } from "react";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { products, getProductsByCategory } from "@/data/products";
import { useConversation } from "@11labs/react";

// Import components
import AdvisorHeader from "./AdvisorHeader";
import ConfigPanel from "./ConfigPanel";
import BotIntroduction from "./BotIntroduction";
import QuickActions from "./QuickActions";
import ConversationView from "./ConversationView";
import InputArea from "./InputArea";

// Import utilities
import { createWebTools, detectToolIntent, processQuery, executeN8nActions, sendToN8nWebhook } from "./toolUtils";
import { speakResponse } from "./voiceUtils";
import { startListening, stopListening } from "./speechRecognition";
import { Message } from "./types";
import { ELEVENLABS_API_KEY } from "./voiceUtils";

// Constants
const N8N_WEBHOOK_URL = ""; // Hier deine n8n Webhook URL eintragen
const USE_N8N_AGENT = false; // Auf true setzen, um den n8n Agenten zu aktivieren

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
Verwende die Informationen, die dir zur Verfügung stehen, um immer die am besten geeignetsten Produktempfehlungen zu geben.

Aktuelle Produktbasis: 
${JSON.stringify(productKnowledgeBase).substring(0, 1000)}...
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
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Message[]>([
    {role: 'assistant', content: "Hallo! Ich bin dein persönlicher Berater für medizinisches Cannabis. Wie kann ich dir heute helfen?"}
  ]);
  const [webhookUrl, setWebhookUrl] = useState(N8N_WEBHOOK_URL);
  const [useN8nAgent, setUseN8nAgent] = useState(USE_N8N_AGENT);
  
  const elevenLabsApiKey = ELEVENLABS_API_KEY;
  const isApiKeySet = true;
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      
      if (conversation.status === "connected") {
        conversation.endSession();
      }
    };
  }, [conversation]);

  const toggleAdvisor = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      if (conversation.status === "connected") {
        conversation.endSession();
        setIsPlaying(false);
      }
      if (isListening) {
        stopListening(recognitionRef, setIsListening);
      }
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
      stopListening(recognitionRef, setIsListening);
    } else {
      startListening(
        setIsListening,
        setTranscript,
        processUserQuery,
        recognitionRef,
        toast
      );
    }
  };

  const webTools = createWebTools(navigate, toast);

  const handleNavigate = (path: string) => {
    const response = webTools.navigateToPage(path);
    setBotResponse(response);
    setConversationHistory(prev => [...prev, { role: 'assistant', content: response }]);
    
    if (isVoiceEnabled) {
      speakResponse(response, isVoiceEnabled, isApiKeySet, conversation, setIsPlaying, isPlaying, toast);
    }
  };

  const fallbackProcessing = (userQuery: string) => {
    const toolIntent = detectToolIntent(userQuery);
    
    if (toolIntent) {
      const { tool, params } = toolIntent;
      const toolResponse = webTools[tool](params);
      
      const botResponseText = `${toolResponse}`;
      setBotResponse(botResponseText);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: botResponseText }]);
      
      if (isVoiceEnabled) {
        speakResponse(botResponseText, isVoiceEnabled, isApiKeySet, conversation, setIsPlaying, isPlaying, toast);
      }
    } else {
      const response = processQuery(userQuery, setRecommendedProducts, setShowProducts);
      
      setBotResponse(response);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: response }]);
      
      if (isVoiceEnabled) {
        speakResponse(response, isVoiceEnabled, isApiKeySet, conversation, setIsPlaying, isPlaying, toast);
      }
    }
  };

  const processUserQuery = async (userQuery: string) => {
    if (userQuery.trim() === "" || isLoading) return;
    
    setIsLoading(true);
    setTranscript(userQuery);
    
    try {
      if (isPlaying && conversation.status === "connected") {
        conversation.endSession();
        setIsPlaying(false);
      }

      setConversationHistory(prev => [...prev, { role: 'user', content: userQuery }]);
      
      if (useN8nAgent && webhookUrl) {
        const n8nResponse = await sendToN8nWebhook(
          userQuery, 
          webhookUrl, 
          useN8nAgent, 
          conversationHistory, 
          productKnowledgeBase, 
          setIsLoading, 
          toast
        );
        
        if (n8nResponse) {
          const { botResponse: n8nMessage, products: n8nProducts, actions } = n8nResponse;
          
          setBotResponse(n8nMessage);
          setConversationHistory(prev => [...prev, { role: 'assistant', content: n8nMessage }]);
          
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
            
            setRecommendedProducts(formattedProducts);
            setShowProducts(formattedProducts.length > 0);
          } else {
            setShowProducts(false);
            setRecommendedProducts([]);
          }
          
          executeN8nActions(actions, navigate, toast, setIsOpen);
          
          if (isVoiceEnabled) {
            speakResponse(n8nMessage, isVoiceEnabled, isApiKeySet, conversation, setIsPlaying, isPlaying, toast);
          }
        } else {
          fallbackProcessing(userQuery);
        }
      } else {
        fallbackProcessing(userQuery);
      }
      
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
          <AdvisorHeader 
            isVoiceEnabled={isVoiceEnabled}
            toggleVoice={toggleVoice}
            toggleAdvisor={toggleAdvisor}
          />

          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesRef}>
            <ConfigPanel 
              webhookUrl={webhookUrl}
              setWebhookUrl={setWebhookUrl}
              useN8nAgent={useN8nAgent}
              setUseN8nAgent={setUseN8nAgent}
            />

            <BotIntroduction />

            <QuickActions 
              onActionClick={processUserQuery}
              onNavigate={handleNavigate}
            />

            <ConversationView 
              conversationHistory={conversationHistory}
              isPlaying={isPlaying}
              transcript={transcript}
              isLoading={isLoading}
              recommendedProducts={recommendedProducts}
              showProducts={showProducts}
              onProductClick={() => setIsOpen(false)}
            />
          </div>

          <InputArea 
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
