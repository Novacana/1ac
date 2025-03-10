import { ProductDetailProps } from "@/components/ProductDetail";

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
    elevenLabsApiKey: string;
  };
  refs: {
    recognitionRef: React.MutableRefObject<SpeechRecognition | null>;
    bottomRef: React.MutableRefObject<HTMLDivElement | null>;
    messagesRef: React.MutableRefObject<HTMLDivElement | null>;
    conversation: any;
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
  };
  tools: {
    webTools: WebTools;
    toast: any;
    navigate: any;
  };
};
