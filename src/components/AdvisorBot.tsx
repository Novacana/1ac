import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User, Loader2, ExternalLink, Volume2, VolumeX, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ApiKeyDialog } from "./ApiKeyDialog";

interface Message {
  role: "user" | "assistant";
  content: string;
  products?: Product[];
  messageId?: string;
}

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

const products = [
  {
    id: "1",
    name: "Medical Cannabis Flower",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1603909223429-69bb7101f92e?q=80&w=2940&auto=format&fit=crop",
    category: "Flowers",
  },
  {
    id: "2",
    name: "CBD Oil Tincture",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1556928045-16f7f50be0f3?q=80&w=2787&auto=format&fit=crop",
    category: "Oils",
  },
  {
    id: "3",
    name: "THC Vape Cartridge",
    price: 34.99,
    image: "https://images.unsplash.com/photo-1625657799852-21d67cc39319?q=80&w=2787&auto=format&fit=crop",
    category: "Vapes",
  },
  {
    id: "4",
    name: "Hemp-Infused Body Cream",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1607621048318-c2d5bdc0ee39?q=80&w=2940&auto=format&fit=crop",
    category: "Topicals",
  },
  {
    id: "5",
    name: "Cannabis-Infused Gummies",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1625517236224-4ab37a6425cb?q=80&w=2848&auto=format&fit=crop",
    category: "Edibles",
  }
];

const ProductAdvisor = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hallo! Ich bin dein persönlicher Berater für medizinisches Cannabis. Wie kann ich dir heute helfen? Du kannst mich zu Produkten, Wirkungsweisen oder Anwendungsgebieten befragen.",
      messageId: "welcome-message"
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elevenlabsApiKey, setElevenlabsApiKey] = useState<string | null>(
    localStorage.getItem("elevenlabsApiKey")
  );
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const toggleAdvisor = () => {
    setIsOpen(!isOpen);
    if (audioRef.current && audioRef.current.played) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    if (isListening) {
      stopListening();
    }
  };

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    
    audio.addEventListener('ended', () => setIsPlaying(false));
    audio.addEventListener('error', () => {
      setIsPlaying(false);
      toast({
        title: "Fehler bei der Audiowiedergabe",
        description: "Die Audiodatei konnte nicht abgespielt werden.",
        variant: "destructive",
      });
    });
    
    return () => {
      audio.pause();
      audio.removeEventListener('ended', () => setIsPlaying(false));
      audio.removeEventListener('error', () => setIsPlaying(false));
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const promptForApiKey = () => {
    setShowApiKeyDialog(true);
  };

  const handleApiKeySave = (key: string) => {
    setElevenlabsApiKey(key);
    setIsVoiceEnabled(true);
  };

  const speakMessage = async (message: string, messageId: string) => {
    if (!isVoiceEnabled) return;
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    let apiKey = elevenlabsApiKey;
    if (!apiKey) {
      apiKey = promptForApiKey();
      if (!apiKey) return;
    }

    try {
      setIsPlaying(true);
      
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/Xb7hH8MSUJpSbSDYk0k2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text: message,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401) {
          toast({
            title: "Ungültiger API-Schlüssel",
            description: "Bitte überprüfe deinen ElevenLabs API-Schlüssel.",
            variant: "destructive",
          });
          localStorage.removeItem("elevenlabsApiKey");
          setElevenlabsApiKey(null);
        } else {
          toast({
            title: "Fehler bei der Sprachgenerierung",
            description: errorData.message || "Ein unbekannter Fehler ist aufgetreten.",
            variant: "destructive",
          });
        }
        setIsPlaying(false);
        return;
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (error) {
      console.error("Error generating speech:", error);
      toast({
        title: "Fehler bei der Sprachgenerierung",
        description: "Ein Fehler ist bei der Verbindung mit ElevenLabs aufgetreten.",
        variant: "destructive",
      });
      setIsPlaying(false);
    }
  };

  const toggleVoice = () => {
    if (!isVoiceEnabled && !elevenlabsApiKey) {
      const key = promptForApiKey();
      if (key) {
        setIsVoiceEnabled(true);
      }
    } else {
      setIsVoiceEnabled(!isVoiceEnabled);
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      }
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
        } else {
          interimTranscript += transcript;
        }
      }
      
      if (finalTranscript !== '') {
        setInput(finalTranscript);
        if (!isLoading) {
          handleSend(finalTranscript);
          stopListening();
        }
      } else if (interimTranscript !== '') {
        setInput(interimTranscript);
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
      setIsListening(false);
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

  const handleSend = async (manualInput?: string) => {
    const userInput = manualInput || input;
    if (userInput.trim() === "" || isLoading) return;

    const userMessage = { role: "user" as const, content: userInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let botResponse = "";
      let recommendedProducts: Product[] = [];
      const userQuery = userInput.toLowerCase();
      
      if (userQuery.includes("schmerz") || userQuery.includes("pain")) {
        botResponse = "Für Schmerzpatienten empfehle ich folgende Produkte, die entzündungshemmend wirken oder bei stärkeren Schmerzen helfen können:";
        recommendedProducts = [products[0], products[1]];
      } else if (userQuery.includes("schlaf") || userQuery.includes("sleep")) {
        botResponse = "Bei Schlafstörungen können diese Produkte besonders hilfreich sein:";
        recommendedProducts = [products[0], products[2]];
      } else if (userQuery.includes("angst") || userQuery.includes("anxiety")) {
        botResponse = "Gegen Angstzustände wirken folgende Produkte besonders gut:";
        recommendedProducts = [products[1], products[3]];
      } else if (userQuery.includes("appetit") || userQuery.includes("hunger")) {
        botResponse = "Diese Produkte können den Appetit anregen:";
        recommendedProducts = [products[0], products[4]];
      } else if (userQuery.includes("thc")) {
        botResponse = "Hier sind unsere THC-haltigen Produkte:";
        recommendedProducts = [products[0], products[2], products[4]];
      } else if (userQuery.includes("cbd")) {
        botResponse = "Hier sind unsere CBD-haltigen Produkte:";
        recommendedProducts = [products[1], products[3]];
      } else if (userQuery.includes("produkt") || userQuery.includes("empfehl") || userQuery.includes("zeig")) {
        botResponse = "Hier sind einige unserer beliebtesten Produkte:";
        recommendedProducts = [...products];
      } else {
        botResponse = "Basierend auf deiner Anfrage könnte ich dir folgende Produkte empfehlen:";
        const randomProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 2);
        recommendedProducts = randomProducts;
      }

      const messageId = `message-${Date.now()}`;
      const assistantMessage = {
        role: "assistant" as const,
        content: botResponse,
        products: recommendedProducts,
        messageId
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (isVoiceEnabled) {
        setTimeout(() => {
          speakMessage(botResponse, messageId);
        }, 300);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Entschuldigung, ich konnte deine Anfrage nicht verarbeiten. Bitte versuche es später noch einmal." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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

      <ApiKeyDialog 
        open={showApiKeyDialog}
        onClose={() => setShowApiKeyDialog(false)}
        onSave={handleApiKeySave}
      />

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
              <span className="font-medium">1A Cannabis-Berater</span>
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

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div 
                  className={cn(
                    "flex flex-col max-w-[85%] rounded-lg p-3", 
                    message.role === "assistant" 
                      ? "bg-secondary text-secondary-foreground self-start rounded-tl-none" 
                      : "bg-primary text-primary-foreground self-end rounded-br-none"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
                    {message.role === "assistant" ? (
                      <>
                        <Bot className="h-3 w-3" /> Berater
                        {isVoiceEnabled && message.messageId && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-5 py-0 px-1.5 ml-1 text-xs flex items-center gap-1"
                            onClick={() => speakMessage(message.content, message.messageId || "")}
                            title={isPlaying && audioRef.current?.src?.includes(message.messageId || "") ? "Pausieren" : "Vorlesen"}
                          >
                            {isPlaying && audioRef.current?.src?.includes(message.messageId || "") ? (
                              <>
                                <span className="inline-block h-2 w-2 bg-current rounded-full animate-pulse"></span>
                                <span className="text-xs">Pause</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="h-3 w-3" />
                                <span className="text-xs">Vorlesen</span>
                              </>
                            )}
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <User className="h-3 w-3" /> Du
                      </>
                    )}
                  </div>
                  {message.content}
                </div>

                {message.products && message.products.length > 0 && (
                  <div className="mt-2 grid gap-2 max-w-[90%]">
                    {message.products.map((product) => (
                      <Link 
                        to={`/product/${product.id}`}
                        key={product.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-all duration-200 animate-scale-in"
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="w-12 h-12 rounded-md overflow-hidden bg-secondary/20 shrink-0">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                          <div className="flex justify-between items-center mt-0.5">
                            <span className="text-xs bg-secondary/40 px-1.5 py-0.5 rounded">{product.category}</span>
                            <span className="font-bold text-sm">€{product.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex max-w-[85%] rounded-lg p-3 bg-secondary text-secondary-foreground self-start rounded-tl-none animate-pulse">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t bg-card">
            <div className="flex items-center justify-center mb-2">
              <div className="flex gap-2 w-full max-w-[240px] justify-center">
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
                <Button
                  variant={isListening ? "default" : "outline"}
                  size="sm"
                  onClick={toggleListening}
                  className={cn(
                    "flex items-center gap-2 justify-center",
                    isListening && "bg-destructive hover:bg-destructive/90"
                  )}
                >
                  {isListening ? (
                    <>
                      <MicOff className="h-4 w-4" />
                      <span>Stopp</span>
                    </>
                  ) : (
                    <>
                      <Mic className="h-4 w-4" />
                      <span>Sprechen</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isListening ? "Sprich jetzt..." : "Frage zu Cannabis-Produkten..."}
                className={cn(
                  "min-h-[60px] resize-none",
                  isListening && "border-primary animate-pulse"
                )}
                disabled={isLoading}
              />
              <Button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="shrink-0"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ProductAdvisor;
