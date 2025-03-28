
import { ProductDetailProps } from "@/components/ProductDetail";
import { ToastActionElement } from "@/components/ui/toast";
import { NavigateFunction } from "react-router-dom";
import { useConversation } from "@11labs/react";
import { Toast, ToasterToast } from "@/hooks/use-toast";

export type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export type WebTools = {
  navigateToPage: (page: string) => string;
  searchProducts: (query: string) => string;
  showProductDetails: (productId: string | number) => string;
  addToCart: (productId: string | number, quantity?: number) => string;
};

export type ToolIntent = {
  tool: keyof WebTools;
  params: any;
};

export type N8nResponse = {
  botResponse: string;
  products: ProductDetailProps[];
  actions: any;
};

// Define a consistent toast function type that matches the actual toast implementation
export type ToastFunction = {
  (props: { title: string; description?: string; action?: ToastActionElement; variant?: "default" | "destructive" }): { id: string; dismiss: () => void; update: (props: ToasterToast) => void; };
  error: (message: string) => { id: string; dismiss: () => void; update: (props: ToasterToast) => void; };
};

// Define the AdvisorState type for use in hooks
export type AdvisorState = {
  state: {
    isOpen: boolean;
    isVoiceEnabled: boolean;
    isListening: boolean;
    isLoading: boolean;
    transcript: string;
    userInput: string;
    botResponse: string;
    isPlaying: boolean;
    recommendedProducts: any[];
    showProducts: boolean;
    conversationHistory: Message[];
    webhookUrl: string;
    useN8nAgent: boolean;
    gdprConsent: boolean;
    isApiKeySet: boolean;
    showGdprNotice: boolean;
    isSpeechInputActive: boolean;
    isFullConversationMode: boolean;
  };
  setters: {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setIsVoiceEnabled: React.Dispatch<React.SetStateAction<boolean>>;
    setIsListening: React.Dispatch<React.SetStateAction<boolean>>;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    setTranscript: React.Dispatch<React.SetStateAction<string>>;
    setUserInput: React.Dispatch<React.SetStateAction<string>>;
    setBotResponse: React.Dispatch<React.SetStateAction<string>>;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    setRecommendedProducts: React.Dispatch<React.SetStateAction<any[]>>;
    setShowProducts: React.Dispatch<React.SetStateAction<boolean>>;
    setConversationHistory: React.Dispatch<React.SetStateAction<Message[]>>;
    setWebhookUrl: React.Dispatch<React.SetStateAction<string>>;
    setUseN8nAgent: React.Dispatch<React.SetStateAction<boolean>>;
    setGdprConsent: React.Dispatch<React.SetStateAction<boolean>>;
    setShowGdprNotice: React.Dispatch<React.SetStateAction<boolean>>;
    setIsSpeechInputActive: React.Dispatch<React.SetStateAction<boolean>>;
    setIsFullConversationMode: React.Dispatch<React.SetStateAction<boolean>>;
  };
  refs: {
    recognitionRef: React.MutableRefObject<SpeechRecognition | null>;
    bottomRef: React.MutableRefObject<HTMLDivElement | null>;
    messagesRef: React.MutableRefObject<HTMLDivElement | null>;
    conversation: ReturnType<typeof useConversation>;
  };
  tools: {
    webTools: WebTools;
    toast: ToastFunction;
    navigate: NavigateFunction;
    processUserQuery?: (userQuery: string) => Promise<void>;
  };
};
