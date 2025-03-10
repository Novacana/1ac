
import { useState, useRef, useEffect } from "react";
import { AdvisorState, Message } from "../types";
import { createWebTools } from "../toolUtils";

export const useAdvisorCore = (
  toast: any,
  navigate: any,
  conversation: any
): AdvisorState => {
  // State definitions
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
  const [webhookUrl, setWebhookUrl] = useState("");
  const [useN8nAgent, setUseN8nAgent] = useState(false);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [showGdprNotice, setShowGdprNotice] = useState(false);
  
  // References
  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);
  const messagesRef = useRef(null);
  
  // API key check
  const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY || "";
  const isApiKeySet = !!elevenLabsApiKey;
  
  // Create web tools
  const webTools = createWebTools(navigate, toast);
  
  // Load consent from localStorage
  useEffect(() => {
    const savedConsent = localStorage.getItem('advisorBotGdprConsent');
    if (savedConsent === 'true') {
      setGdprConsent(true);
    }
  }, []);
  
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
      isApiKeySet
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
      setShowGdprNotice
    },
    refs: {
      recognitionRef,
      bottomRef,
      messagesRef,
      conversation
    },
    tools: {
      webTools,
      toast,
      navigate
    }
  };
};
