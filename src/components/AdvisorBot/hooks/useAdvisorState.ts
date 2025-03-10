
import { useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useConversation } from "@11labs/react";
import { Message, ToastFunction, AdvisorState } from "../types";
import { createWebTools } from "../toolUtils";
import { ELEVENLABS_API_KEY } from "../voiceUtils";

// Constants
const N8N_WEBHOOK_URL = "https://n8n-tejkg.ondigitalocean.app/webhook/50aea9a1-9064-49c7-aea6-3a8714b26157";
const USE_N8N_AGENT = true;

export const useAdvisorState = (): AdvisorState => {
  const { toast } = useToast();
  const toastFn = toast as unknown as ToastFunction;
  const navigate = useNavigate();
  
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
  const [webhookUrl, setWebhookUrl] = useState(N8N_WEBHOOK_URL);
  const [useN8nAgent, setUseN8nAgent] = useState(USE_N8N_AGENT);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [showGdprNotice, setShowGdprNotice] = useState(false);
  
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
      setGdprConsent,
      setShowGdprNotice,
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
