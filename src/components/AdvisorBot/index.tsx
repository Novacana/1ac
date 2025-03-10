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
import { Message, ToastFunction } from "./types";
import { ELEVENLABS_API_KEY } from "./voiceUtils";

// Constants
const N8N_WEBHOOK_URL = "https://n8n-tejkg.ondigitalocean.app/webhook/50aea9a1-9064-49c7-aea6-3a8714b26157"; // User provided webhook URL
const USE_N8N_AGENT = true; // Enable n8n agent by default

// DSGVO-Hinweis für die Spracherkennung und Sprachausgabe
const gdprNotice = `
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
  const toastFn = toast as unknown as ToastFunction;
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
  const [gdprConsent, setGdprConsent] = useState(false);
  const [showGdprNotice, setShowGdprNotice] = useState(false);
  
  const elevenLabsApiKey = ELEVENLABS_API_KEY;
  const isApiKeySet = !!elevenLabsApiKey;
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  const conversation = useConversation({
    onError: (error) => {
      console.error("ElevenLabs error:", error);
      toastFn({
        title: "Fehler bei der Sprachausgabe",
        description: "Es gab ein Problem mit der ElevenLabs Sprachausgabe.",
        variant: "destructive",
      });
    }
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem('advisorBotGdprConsent');
    if (savedConsent === 'true') {
      setGdprConsent(true);
    }
    
    return () => {
      if (recognitionRef.current) {
        stopListening(recognitionRef, setIsListening);
      }
      
      if (conversation.status === "connected") {
        conversation.endSession();
      }
    };
  }, [conversation]);

  useEffect(() => {
    if (messagesRef.current && bottomRef.current && isOpen) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationHistory, isOpen]);

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
    if (isVoiceEnabled) {
      if (isPlaying && conversation.status === "connected") {
        conversation.endSession();
        setIsPlaying(false);
      }
    }
    setIsVoiceEnabled(!isVoiceEnabled);
  };

  const toggleListening = () => {
    if (!gdprConsent) {
      setShowGdprNotice(true);
      return;
    }
    
    if (isListening) {
      stopListening(recognitionRef, setIsListening);
    } else {
      startListening(
        setIsListening,
        setTranscript,
        processUserQuery,
        recognitionRef,
        toastFn
      );
    }
  };

  const handleConsentChange = () => {
    setGdprConsent(true);
    localStorage.setItem('advisorBotGdprConsent', 'true');
    setShowGdprNotice(false);
    
    toastFn({
      title: "DSGVO-Zustimmung erteilt",
      description: "Vielen Dank für Ihre Zustimmung. Sie können jetzt die Spracherkennung nutzen.",
    });
  };

  const handleDismissGdprNotice = () => {
    setShowGdprNotice(false);
  };

  const webTools = createWebTools(navigate, toastFn);

  const handleNavigate = (path: string) => {
    const response = webTools.navigateToPage(path);
    setBotResponse(response);
    setConversationHistory(prev => [...prev, { role: 'assistant', content: response }]);
    
    if (isVoiceEnabled && gdprConsent) {
      speakResponse(response, isVoiceEnabled, isApiKeySet, conversation, setIsPlaying, isPlaying, toastFn);
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
      
      if (isVoiceEnabled && gdprConsent) {
        speakResponse(botResponseText, isVoiceEnabled, isApiKeySet, conversation, setIsPlaying, isPlaying, toastFn);
      }
    } else {
      const response = processQuery(userQuery, setRecommendedProducts, setShowProducts);
      
      setBotResponse(response);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: response }]);
      
      if (isVoiceEnabled && gdprConsent) {
        speakResponse(response, isVoiceEnabled, isApiKeySet, conversation, setIsPlaying, isPlaying, toastFn);
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
        try {
          const n8nResponse = await sendToN8nWebhook(
            userQuery, 
            webhookUrl, 
            useN8nAgent, 
            conversationHistory, 
            productKnowledgeBase,
            setIsLoading,
            toastFn
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
            
            executeN8nActions(actions, navigate, toastFn, setIsOpen);
            
            if (isVoiceEnabled && gdprConsent) {
              speakResponse(n8nMessage, isVoiceEnabled, isApiKeySet, conversation, setIsPlaying, isPlaying, toastFn);
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
            {showGdprNotice && (
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                <Card className="max-w-md w-full shadow-lg border-2 border-primary">
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl font-bold text-red-600 dark:text-red-400">
                      DSGVO-Zustimmung erforderlich
                    </h3>
                    <p className="text-sm">
                      {gdprNotice}
                    </p>
                    <div className="flex justify-end gap-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={handleDismissGdprNotice}
                      >
                        Ablehnen
                      </Button>
                      <Button 
                        variant="default"
                        onClick={handleConsentChange}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        Zustimmen
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {!gdprConsent && (
              <div className="border rounded-md p-3 bg-primary/10 text-sm">
                <h4 className="font-medium mb-2">DSGVO-Hinweis</h4>
                <p className="text-xs mb-3">{gdprNotice}</p>
                <Button 
                  variant="default" 
                  size="sm"
                  className="w-full"
                  onClick={handleConsentChange}
                >
                  Ich stimme der Verarbeitung meiner Sprachdaten zu
                </Button>
              </div>
            )}

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

            <div ref={bottomRef} />
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
