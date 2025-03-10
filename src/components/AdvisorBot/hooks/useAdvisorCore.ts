
import { useState, useRef, useEffect } from "react";
import { AdvisorState, Message } from "../types";
import { createWebTools } from "../utils/webTools";

export const useAdvisorCore = (
  navigate: any,
  toast: any,
  useConversation: any
) => {
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
  const [webhookUrl, setWebhookUrl] = useState("https://n8n-tejkg.ondigitalocean.app/webhook/50aea9a1-9064-49c7-aea6-3a8714b26157");
  const [useN8nAgent, setUseN8nAgent] = useState(true);
  const [gdprConsent, setGdprConsent] = useState(false);
  const [showGdprNotice, setShowGdprNotice] = useState(false);
  
  const elevenLabsApiKey = "e9d69bd26aaea5fc0e626febff0e5c6f"; // From voiceUtils
  const isApiKeySet = !!elevenLabsApiKey;

  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);
  const messagesRef = useRef(null);
  
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

  // Create web tools for navigation, product search, etc.
  const webTools = createWebTools(navigate, toast);

  // Scroll to bottom of messages when conversation updates
  useEffect(() => {
    if (messagesRef.current && bottomRef.current && isOpen) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationHistory, isOpen]);

  // Load GDPR consent from localStorage
  useEffect(() => {
    const savedConsent = localStorage.getItem('advisorBotGdprConsent');
    if (savedConsent === 'true') {
      setGdprConsent(true);
    }
    
    // Cleanup function to stop listening and end conversation
    return () => {
      if (recognitionRef.current) {
        // stopListening would be called here
      }
      
      if (conversation.status === "connected") {
        conversation.endSession();
      }
    };
  }, [conversation]);

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
