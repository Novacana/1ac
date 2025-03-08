import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User, Loader2, ExternalLink, Volume2, VolumeX, Mic, MicOff, ChevronUp, Search, ShoppingCart, Book, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { products, getProductsByCategory } from "@/data/products";
import { ProductDetailProps } from "@/components/ProductDetail";
import { useConversation } from "@11labs/react";
import { Input } from "@/components/ui/input";

const ELEVENLABS_API_KEY = "e9d69bd26aaea5fc0e626febff0e5c6f";

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

const N8N_WEBHOOK_URL = ""; // Hier deine n8n Webhook URL eintragen
const USE_N8N_AGENT = false; // Auf true setzen, um den n8n Agenten zu aktivieren

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
  const [recommendedProducts, setRecommendedProducts] = useState<ProductDetailProps[]>([]);
  const [showProducts, setShowProducts] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{role: 'user' | 'assistant', content: string}[]>([
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
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversationHistory, recommendedProducts]);

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
        stopListening();
      }
    }
  };

  const sendToN8nWebhook = async (userMessage: string) => {
    if (!webhookUrl || !useN8nAgent) return null;
    
    try {
      setIsLoading(true);
      console.log("Sende Anfrage an n8n Webhook:", webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_history: conversationHistory,
          user_info: {
            page: window.location.pathname,
            timestamp: new Date().toISOString()
          },
          available_products: productKnowledgeBase,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Webhook responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Antwort vom n8n Webhook:", data);
      
      return {
        botResponse: data.message || "Ich konnte keine Antwort vom n8n-Agenten erhalten.",
        products: data.products || [],
        actions: data.actions || {}
      };
    } catch (error) {
      console.error("Fehler bei der Kommunikation mit n8n:", error);
      toast({
        title: "Fehler bei der n8n-Kommunikation",
        description: "Es gab ein Problem mit dem n8n Webhook.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const executeN8nActions = (actions: any) => {
    if (!actions) return;
    
    if (actions.navigate_to) {
      setTimeout(() => {
        setIsOpen(false);
        navigate(actions.navigate_to);
      }, 1000);
    }
    
    if (actions.add_to_cart) {
      const { product_id, quantity = 1 } = actions.add_to_cart;
      const product = products.find(p => p.id === product_id);
      
      if (product) {
        toast({
          title: "Produkt zum Warenkorb hinzugefügt",
          description: `${quantity}x ${product.name} wurde zum Warenkorb hinzugefügt.`,
        });
      }
    }
    
    if (actions.custom_action) {
      console.log("Führe benutzerdefinierte Aktion aus:", actions.custom_action);
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
      
      const options = {
        overrides: {
          tts: {
            voiceId: "XB0fDUnXU5powFXDhCwa",
          },
          agent: {
            language: "de",
          }
        }
      };
      
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
        }, text.length * 80);
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

  const webTools = {
    navigateToPage: (page: string) => {
      let route = '';
      
      if (page.toLowerCase().includes('home') || page === '/') {
        route = '/';
      } else if (page.toLowerCase().includes('product') && !page.includes('/')) {
        route = '/products';
      } else if (page.toLowerCase().includes('cart') || page.toLowerCase().includes('warenkorb')) {
        route = '/cart';
      } else if (page.toLowerCase().includes('checkout') || page.toLowerCase().includes('kasse')) {
        route = '/checkout';
      } else {
        route = page;
      }
      
      setTimeout(() => {
        setIsOpen(false);
        navigate(route);
      }, 1000);
      
      return `Ich navigiere zu ${route}`;
    },
    
    searchProducts: (query: string) => {
      const lowerQuery = query.toLowerCase();
      let matchedProducts = products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        (p.strain && p.strain.toLowerCase().includes(lowerQuery)) ||
        (p.category && p.category.toLowerCase().includes(lowerQuery)) ||
        (p.effects && p.effects.some(e => e.toLowerCase().includes(lowerQuery))) ||
        (p.benefits && p.benefits.some(b => b.toLowerCase().includes(lowerQuery))) ||
        (p.terpenes && p.terpenes.some(t => t.name.toLowerCase().includes(lowerQuery)))
      );
      
      if (matchedProducts.length > 3) {
        matchedProducts = matchedProducts.slice(0, 3);
      }
      
      setRecommendedProducts(matchedProducts);
      setShowProducts(matchedProducts.length > 0);
      
      return `Ich habe ${matchedProducts.length} Produkte gefunden, die zu "${query}" passen.`;
    },
    
    showProductDetails: (productId: string | number) => {
      const id = typeof productId === 'number' ? productId : productId;
      const product = products.find(p => p.id === id);
      
      if (product) {
        setTimeout(() => {
          setIsOpen(false);
          navigate(`/product/${id}`);
        }, 1000);
        return `Ich zeige dir Details zu ${product.name}`;
      }
      
      return "Ich konnte dieses Produkt nicht finden.";
    },
    
    addToCart: (productId: string | number, quantity: number = 1) => {
      const id = typeof productId === 'number' ? productId : productId;
      const product = products.find(p => p.id === id);
      
      if (product) {
        toast({
          title: "Produkt zum Warenkorb hinzugefügt",
          description: `${quantity}x ${product.name} wurde zum Warenkorb hinzugefügt.`,
        });
        
        return `Ich habe ${quantity}x ${product.name} zum Warenkorb hinzugefügt.`;
      }
      
      return "Ich konnte dieses Produkt nicht finden.";
    }
  };

  const detectToolIntent = (message: string): {tool: keyof typeof webTools, params: any} | null => {
    const lowerMessage = message.toLowerCase();
    
    if (
      lowerMessage.includes('geh zu') || 
      lowerMessage.includes('zeig mir die') || 
      lowerMessage.includes('navigiere zu') || 
      lowerMessage.includes('öffne') ||
      lowerMessage.includes('zur seite')
    ) {
      if (lowerMessage.includes('startseite') || lowerMessage.includes('homepage')) {
        return { tool: 'navigateToPage', params: '/' };
      }
      if (lowerMessage.includes('produkt') && !lowerMessage.includes('produkte')) {
        const productIdMatch = lowerMessage.match(/produkt\s+(\d+)/i);
        if (productIdMatch && productIdMatch[1]) {
          return { tool: 'showProductDetails', params: productIdMatch[1] };
        }
      }
      if (lowerMessage.includes('produkte') || lowerMessage.includes('produktseite')) {
        return { tool: 'navigateToPage', params: '/products' };
      }
      if (lowerMessage.includes('warenkorb') || lowerMessage.includes('cart')) {
        return { tool: 'navigateToPage', params: '/cart' };
      }
      if (lowerMessage.includes('kasse') || lowerMessage.includes('checkout')) {
        return { tool: 'navigateToPage', params: '/checkout' };
      }
    }
    
    if (
      lowerMessage.includes('such') || 
      lowerMessage.includes('find') || 
      lowerMessage.includes('zeig mir produkte für')
    ) {
      let searchQuery = "";
      if (lowerMessage.includes('für')) {
        const parts = lowerMessage.split('für');
        if (parts.length > 1) {
          searchQuery = parts[1].trim();
        }
      } else if (lowerMessage.includes('zu')) {
        const parts = lowerMessage.split('zu');
        if (parts.length > 1) {
          searchQuery = parts[1].trim();
        }
      } else if (lowerMessage.includes('nach')) {
        const parts = lowerMessage.split('nach');
        if (parts.length > 1) {
          searchQuery = parts[1].trim();
        }
      } else {
        const keywords = ['schmerz', 'schlaf', 'angst', 'appetit', 'fokus', 'energie', 'entspannung', 'indica', 'sativa', 'hybrid'];
        for (const keyword of keywords) {
          if (lowerMessage.includes(keyword)) {
            searchQuery = keyword;
            break;
          }
        }
      }
      
      if (searchQuery) {
        return { tool: 'searchProducts', params: searchQuery };
      }
    }
    
    if (
      lowerMessage.includes('zum warenkorb hinzufügen') || 
      lowerMessage.includes('in den warenkorb') || 
      lowerMessage.includes('kaufen') ||
      lowerMessage.includes('bestellen')
    ) {
      const productIdMatch = lowerMessage.match(/produkt\s+(\d+)/i);
      const quantityMatch = lowerMessage.match(/(\d+)\s*stück/i);
      
      if (productIdMatch && productIdMatch[1]) {
        const productId = productIdMatch[1];
        const quantity = quantityMatch && quantityMatch[1] ? parseInt(quantityMatch[1]) : 1;
        return { tool: 'addToCart', params: { productId, quantity } };
      }
    }
    
    if (
      lowerMessage.includes('details zu produkt') || 
      lowerMessage.includes('mehr über produkt') || 
      lowerMessage.includes('information zu produkt')
    ) {
      const productIdMatch = lowerMessage.match(/produkt\s+(\d+)/i);
      if (productIdMatch && productIdMatch[1]) {
        return { tool: 'showProductDetails', params: productIdMatch[1] };
      }
    }
    
    return null;
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
        const n8nResponse = await sendToN8nWebhook(userQuery);
        
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
          
          executeN8nActions(actions);
          
          if (isVoiceEnabled) {
            speakResponse(n8nMessage);
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

  const fallbackProcessing = (userQuery: string) => {
    const toolIntent = detectToolIntent(userQuery);
    
    if (toolIntent) {
      const { tool, params } = toolIntent;
      const toolResponse = webTools[tool](params);
      
      const botResponseText = `${toolResponse}`;
      setBotResponse(botResponseText);
      setConversationHistory(prev => [...prev, { role: 'assistant', content: botResponseText }]);
      
      if (isVoiceEnabled) {
        speakResponse(botResponseText);
      }
    } else {
      let response = "";
      let matchedProducts: ProductDetailProps[] = [];
      const lowercaseQuery = userQuery.toLowerCase();
      
      if (lowercaseQuery.includes("schmerz") || lowercaseQuery.includes("pain")) {
        response = "Für Schmerzpatienten empfehle ich folgende Produkte, die entzündungshemmend wirken oder bei stärkeren Schmerzen helfen können:";
        matchedProducts = [...products.filter(p => 
          p.effects?.some(e => e.toLowerCase().includes("schmerz")) ||
          p.benefits?.some(b => b.toLowerCase().includes("schmerz"))
        )].slice(0, 3);
      } else if (lowercaseQuery.includes("schlaf") || lowercaseQuery.includes("sleep")) {
        response = "Bei Schlafstörungen können diese Produkte besonders hilfreich sein:";
        matchedProducts = [...products.filter(p => 
          p.effects?.some(e => e.toLowerCase().includes("schlaf")) ||
          p.benefits?.some(b => b.toLowerCase().includes("schlaf"))
        )].slice(0, 3);
      } else if (lowercaseQuery.includes("angst") || lowercaseQuery.includes("anxiety")) {
        response = "Gegen Angstzustände wirken folgende Produkte besonders gut:";
        matchedProducts = [...products.filter(p => 
          p.effects?.some(e => e.toLowerCase().includes("angst")) ||
          p.benefits?.some(b => b.toLowerCase().includes("angst")) ||
          p.strain?.toLowerCase().includes("indica")
        )].slice(0, 3);
      } else if (lowercaseQuery.includes("appetit") || lowercaseQuery.includes("hunger")) {
        response = "Diese Produkte können den Appetit anregen:";
        matchedProducts = [...products.filter(p => 
          p.strain?.toLowerCase().includes("indica") || 
          parseFloat(p.thc?.replace("%", "") || "0") > 15
        )].slice(0, 3);
      } else if (lowercaseQuery.includes("thc")) {
        response = "Hier sind unsere THC-haltigen Produkte:";
        matchedProducts = [...products.filter(p => 
          parseFloat(p.thc?.replace("%", "") || "0") > 15
        )].slice(0, 3);
      } else if (lowercaseQuery.includes("cbd")) {
        response = "Hier sind unsere CBD-haltigen Produkte:";
        matchedProducts = [...products.filter(p => 
          parseFloat(p.cbd?.replace("%", "") || "0") > 0.5
        )].slice(0, 3);
      } else if (lowercaseQuery.includes("kreativ") || lowercaseQuery.includes("fokus") || lowercaseQuery.includes("concentration")) {
        response = "Für Kreativität und Fokus sind diese Sorten besonders geeignet:";
        matchedProducts = [...products.filter(p => 
          p.strain?.toLowerCase().includes("sativa") ||
          p.effects?.some(e => e.toLowerCase().includes("fokus") || e.toLowerCase().includes("kreativ"))
        )].slice(0, 3);
      } else if (lowercaseQuery.includes("indica")) {
        response = "Hier sind unsere Indica-Sorten, die für tiefe Entspannung bekannt sind:";
        matchedProducts = [...products.filter(p => 
          p.strain?.toLowerCase().includes("indica")
        )].slice(0, 3);
      } else if (lowercaseQuery.includes("sativa")) {
        response = "Hier sind unsere Sativa-Sorten, die für energetische Effekte bekannt sind:";
        matchedProducts = [...products.filter(p => 
          p.strain?.toLowerCase().includes("sativa")
        )].slice(0, 3);
      } else if (lowercaseQuery.includes("hybrid")) {
        response = "Hier sind unsere ausgewogenen Hybrid-Sorten:";
        matchedProducts = [...products.filter(p => 
          p.strain?.toLowerCase().includes("hybrid")
        )].slice(0, 3);
      } else if (lowercaseQuery.includes("produkt") || lowercaseQuery.includes("empfehl") || lowercaseQuery.includes("zeig")) {
        response = "Hier sind einige unserer beliebtesten Produkte:";
        matchedProducts = [...products].slice(0, 3);
      } else {
        response = "Basierend auf deiner Anfrage könnte ich dir folgende Produkte empfehlen:";
        const randomProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 3);
        matchedProducts = randomProducts;
      }

      setBotResponse(response);
      setRecommendedProducts(matchedProducts);
      setShowProducts(matchedProducts.length > 0);
      
      setConversationHistory(prev => [...prev, { role: 'assistant', content: response }]);
      
      if (isVoiceEnabled) {
        speakResponse(response);
      }
    }
  };

  const renderMessage = (message: {role: 'user' | 'assistant', content: string}, index: number) => {
    if (message.role === 'user') {
      return (
        <div key={index} className="animate-fade-in ml-auto">
          <div className="bg-primary text-primary-foreground self-end rounded-lg p-3 rounded-br-none">
            <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
              <User className="h-3 w-3" /> Du
            </div>
            {message.content}
          </div>
        </div>
      );
    } else {
      return (
        <div key={index} className="animate-fade-in">
          <div className="bg-secondary text-secondary-foreground self-start rounded-lg p-3 rounded-tl-none">
            <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
              <Bot className="h-3 w-3" /> Berater
              {isPlaying && index === conversationHistory.length - 1 && (
                <span className="inline-flex gap-1">
                  <span className="inline-block h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="inline-block h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="inline-block h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </span>
              )}
            </div>
            {message.content}
          </div>
        </div>
      );
    }
  };

  const renderToolButton = (icon: React.ReactNode, label: string, onClick: () => void) => {
    return (
      <Button 
        variant="outline"
        size="sm"
        onClick={onClick}
        className="bg-secondary/20 border-secondary/40 hover:bg-secondary/30 gap-1.5"
      >
        {icon}
        <span className="text-xs">{label}</span>
      </Button>
    );
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
          <div className="p-3 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-medium">1A Cannabis-Berater (KI)</span>
            </div>
            <div className="flex items-center gap-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleVoice} 
                className="flex items-center gap-1 h-8 bg-primary/20 hover:bg-primary/30 border-primary/40 text-primary-foreground"
                title={isVoiceEnabled ? "Stimme ausschalten" : "Stimme einschalten"}
              >
                {isVoiceEnabled ? (
                  <>
                    <Volume2 className="h-4 w-4" />
                    <span className="text-xs">Stimme an</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="h-4 w-4" />
                    <span className="text-xs">Stimme aus</span>
                  </>
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleAdvisor} 
                className="h-8 w-8 text-primary-foreground"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesRef}>
            {process.env.NODE_ENV === 'development' && (
              <div className="border rounded-md p-3 bg-accent/10 text-xs">
                <h4 className="font-medium mb-2">N8N Webhook Konfiguration</h4>
                <div className="space-y-2">
                  <div>
                    <Input 
                      type="text" 
                      placeholder="N8N Webhook URL" 
                      value={webhookUrl} 
                      onChange={(e) => setWebhookUrl(e.target.value)}
                      className="text-xs h-8 mb-1"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="useN8nAgent" 
                      checked={useN8nAgent} 
                      onChange={(e) => setUseN8nAgent(e.target.checked)}
                    />
                    <label htmlFor="useN8nAgent" className="text-xs">N8N Agent aktivieren</label>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col items-center justify-center text-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-medium">Cannabis-Berater (KI)</h3>
              <p className="text-sm text-muted-foreground">Sprich mit mir über Cannabis-Produkte</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center mb-2">
              {renderToolButton(<Search className="h-3.5 w-3.5" />, "Produktsuche", () => processUserQuery("Zeig mir Produkte für Schmerzen"))}
              {renderToolButton(<ShoppingCart className="h-3.5 w-3.5" />, "Warenkorb", () => webTools.navigateToPage('/cart'))}
              {renderToolButton(<Book className="h-3.5 w-3.5" />, "Produkte", () => webTools.navigateToPage('/products'))}
              {renderToolButton(<Info className="h-3.5 w-3.5" />, "Was ist CBD?", () => processUserQuery("Was ist CBD?"))}
            </div>

            <div className="space-y-4">
              {conversationHistory.map((message, index) => (
                renderMessage(message, index)
              ))}
            </div>

            {transcript && (
              <div className="animate-fade-in">
                <div className="bg-primary text-primary-foreground self-end rounded-lg p-3 rounded-br-none ml-auto">
                  <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
                    <User className="h-3 w-3" /> Du
                  </div>
                  {transcript}
                </div>
              </div>
            )}

            {showProducts && recommendedProducts.length > 0 && (
              <div className="mt-2 grid gap-2 max-w-[90%]">
                {recommendedProducts.map((product) => (
                  <Link 
                    to={`/product/${product.id}`}
                    key={product.id}
                    className="flex items-center gap-3 p-2 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-all duration-200 animate-scale-in"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-12 h-12 rounded-md overflow-hidden bg-secondary/20 shrink-0">
                      <img 
                        src={product.images?.[0] || "/placeholder.svg"} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-xs bg-secondary/40 px-1.5 py-0.5 rounded">{
                          product.category === "Blüten" ? "Blüten" : 
                          product.category === "Öle" ? "Öle" : 
                          product.category
                        }</span>
                        <span className="font-bold text-sm">€{product.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                  </Link>
                ))}
              </div>
            )}

            {isLoading && (
              <div className="flex max-w-[85%] rounded-lg p-3 bg-secondary text-secondary-foreground self-start rounded-tl-none animate-pulse">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t bg-card">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Schreibe eine Nachricht..."
                  className="flex-1"
                />
                <Button
                  disabled={!userInput.trim() || isLoading}
                  onClick={handleSendMessage}
                  size="icon"
                  className="shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-center mb-1">
                <Button
                  variant={isListening ? "destructive" : "default"}
                  size="sm"
                  onClick={toggleListening}
                  className="w-full h-10 rounded-full gap-2"
                >
                  {isListening ? (
                    <>
                      <div className="relative">
                        <Mic className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                      </div>
                      <span>Zuhören... (Klick zum Stoppen)</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-5 w-5" />
                      <span>Drücke zum Sprechen</span>
                    </>
                  )}
                </Button>
              </div>
              
              <div className="flex items-center justify-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleVoice}
                  className="flex items-center gap-2 justify-center"
                >
                  {isVoiceEnabled ? (
                    <>
                      <Volume2 className="h-4 w-4" />
                      <span>Stimme: An</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="h-4 w-4" />
                      <span>Stimme: Aus</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ProductAdvisor;
