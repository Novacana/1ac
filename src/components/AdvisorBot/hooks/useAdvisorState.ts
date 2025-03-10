
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useConversation } from "@11labs/react";
import { Message, ToastFunction, AdvisorState } from "../types";
import { createWebTools } from "../utils/webTools";
import { ELEVENLABS_API_KEY } from "../voiceUtils";

// Constants - Fixed default webhook URL
const N8N_WEBHOOK_URL = "https://n8n-tejkg.ondigitalocean.app/webhook-test/50aea9a1-9064-49c7-aea6-3a8714b26157";
const USE_N8N_AGENT = true;

export const useAdvisorState = (): AdvisorState => {
  const { toast } = useToast();
  const toastFn = toast as unknown as ToastFunction;
  const navigate = useNavigate();
  
  // Try to load saved configuration from localStorage first
  const getSavedValue = (key: string, defaultValue: any) => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsedValue = JSON.parse(saved);
        console.log(`Loaded ${key} from localStorage:`, parsedValue);
        return parsedValue;
      }
      console.log(`No saved value for ${key}, using default:`, defaultValue);
      return defaultValue;
    } catch (e) {
      console.error("Error loading saved config:", e);
      return defaultValue;
    }
  };
  
  // State
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
  
  // Voice chat specific state
  const [isSpeechInputActive, setIsSpeechInputActive] = useState(false);
  const [isFullConversationMode, setIsFullConversationMode] = useState(true);
  
  // Load n8n configuration from localStorage with defaults if not found
  const [webhookUrl, setWebhookUrl] = useState(getSavedValue('n8nWebhookUrl', N8N_WEBHOOK_URL));
  const [useN8nAgent, setUseN8nAgent] = useState(getSavedValue('useN8nAgent', USE_N8N_AGENT));
  
  // Ensure the settings are also saved when they change
  useEffect(() => {
    localStorage.setItem('n8nWebhookUrl', JSON.stringify(webhookUrl));
    console.log("Saved webhookUrl to localStorage:", webhookUrl);
  }, [webhookUrl]);
  
  useEffect(() => {
    localStorage.setItem('useN8nAgent', JSON.stringify(useN8nAgent));
    console.log("Saved useN8nAgent to localStorage:", useN8nAgent);
  }, [useN8nAgent]);
  
  // Save n8n config changes to localStorage
  const updateWebhookUrl = (url: string) => {
    console.log("Updating webhook URL to:", url);
    setWebhookUrl(url);
    localStorage.setItem('n8nWebhookUrl', JSON.stringify(url));
  };
  
  const updateUseN8nAgent = (use: boolean) => {
    console.log("Updating useN8nAgent to:", use);
    setUseN8nAgent(use);
    localStorage.setItem('useN8nAgent', JSON.stringify(use));
  };
  
  const [gdprConsent, setGdprConsent] = useState(getSavedValue('gdprConsent', false));
  const [showGdprNotice, setShowGdprNotice] = useState(!getSavedValue('gdprConsent', false));
  
  // Save GDPR consent to localStorage
  const updateGdprConsent = (consent: boolean) => {
    setGdprConsent(consent);
    localStorage.setItem('gdprConsent', JSON.stringify(consent));
  };
  
  // API Key
  const elevenLabsApiKey = ELEVENLABS_API_KEY;
  const isApiKeySet = !!elevenLabsApiKey;
  
  // Refs
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);

  // Initialize ElevenLabs conversation
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

  // Tools
  const webTools = createWebTools(navigate, toastFn);

  console.log("AdvisorState initialized with n8n config:", {
    webhookUrl,
    useN8nAgent
  });

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
      showGdprNotice,
      isSpeechInputActive,
      isFullConversationMode,
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
      setWebhookUrl: updateWebhookUrl,
      setUseN8nAgent: updateUseN8nAgent,
      setGdprConsent: updateGdprConsent,
      setShowGdprNotice,
      setIsSpeechInputActive,
      setIsFullConversationMode,
    },
    refs: {
      recognitionRef,
      bottomRef,
      messagesRef,
      conversation,
    },
    tools: {
      webTools,
      toast: toastFn,
      navigate,
    }
  };
};
