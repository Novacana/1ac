
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useConversation } from "@11labs/react";
import { products } from "@/data/products";
import { Message } from "../types";
import { 
  startListening, 
  stopListening 
} from "../speechRecognition";
import { 
  speakResponse 
} from "../voiceUtils";
import { 
  createWebTools, 
  detectToolIntent, 
  processQuery,
  executeN8nActions,
  sendToN8nWebhook
} from "../toolUtils"; // Now imports from the barrel file
import { ELEVENLABS_API_KEY } from "../voiceUtils";

// Constants
const N8N_WEBHOOK_URL = ""; // Hier deine n8n Webhook URL eintragen
const USE_N8N_AGENT = false; // Auf true setzen, um den n8n Agenten zu aktivieren

export const useAdvisorState = () => {
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
  const [gdprConsent, setGdprConsent] = useState(false);
  
  const elevenLabsApiKey = ELEVENLABS_API_KEY;
  const isApiKeySet = !!elevenLabsApiKey;
  
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
    // Consent-Status aus dem localStorage laden
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

  // Prüfen, ob der Benutzer beim Scrollen das Ende der Nachrichtenliste erreicht hat
  useEffect(() => {
    if (messagesRef.current && bottomRef.current && isOpen) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationHistory, isOpen]);

  const webTools = createWebTools(navigate, toast);

  return {
    state: {
      isOpen,
      isVoiceEnabled,
      isListening,
      isLoading,
      transcript,
      userInput,
      botResponse,
      isPlaying,
      recommendedProducts,
      showProducts,
      conversationHistory,
      webhookUrl,
      useN8nAgent,
      gdprConsent,
      isApiKeySet,
      elevenLabsApiKey
    },
    refs: {
      recognitionRef,
      bottomRef,
      messagesRef,
      conversation
    },
    setters: {
      setIsOpen,
      setIsVoiceEnabled,
      setIsListening,
      setIsLoading,
      setTranscript,
      setUserInput,
      setBotResponse,
      setIsPlaying,
      setRecommendedProducts,
      setShowProducts,
      setConversationHistory,
      setWebhookUrl,
      setUseN8nAgent,
      setGdprConsent
    },
    tools: {
      webTools,
      toast,
      navigate
    }
  };
};
