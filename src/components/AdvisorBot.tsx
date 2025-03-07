
import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, User, Loader2, ExternalLink, Volume2, VolumeX, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  category: string;
}

// Sample products data
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
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [botResponse, setBotResponse] = useState("Hallo! Ich bin dein persönlicher Berater für medizinisches Cannabis. Wie kann ich dir heute helfen?");
  const [isPlaying, setIsPlaying] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [showProducts, setShowProducts] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [botResponse, recommendedProducts]);

  useEffect(() => {
    if (isOpen && isVoiceEnabled && botResponse && !isPlaying) {
      speakResponse(botResponse);
    }
  }, [botResponse, isOpen, isVoiceEnabled]);

  useEffect(() => {
    // Cleanup function for speech services
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleAdvisor = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      // Stop all audio if closing the advisor
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      }
      if (isListening) {
        stopListening();
      }
    }
  };

  const speakResponse = (text: string) => {
    if (!isVoiceEnabled) return;
    
    try {
      if (isPlaying && speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }

      setIsPlaying(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        toast({
          title: "Fehler bei der Sprachausgabe",
          description: "Die Sprachausgabe konnte nicht gestartet werden.",
          variant: "destructive",
        });
      };
      
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
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
    if (isPlaying && speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
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
          // Display interim results in real-time
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
        // Restart if it ends unexpectedly while still in listening mode
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

  const processUserQuery = async (userQuery: string) => {
    if (userQuery.trim() === "" || isLoading) return;
    
    setIsLoading(true);
    setTranscript(userQuery); // Display the final transcript

    try {
      // If bot is currently speaking, stop it
      if (isPlaying && speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      }

      // Simulate a delay for processing
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let response = "";
      let matchedProducts: Product[] = [];
      const query = userQuery.toLowerCase();
      
      if (query.includes("schmerz") || query.includes("pain")) {
        response = "Für Schmerzpatienten empfehle ich folgende Produkte, die entzündungshemmend wirken oder bei stärkeren Schmerzen helfen können:";
        matchedProducts = [products[0], products[1]];
      } else if (query.includes("schlaf") || query.includes("sleep")) {
        response = "Bei Schlafstörungen können diese Produkte besonders hilfreich sein:";
        matchedProducts = [products[0], products[2]];
      } else if (query.includes("angst") || query.includes("anxiety")) {
        response = "Gegen Angstzustände wirken folgende Produkte besonders gut:";
        matchedProducts = [products[1], products[3]];
      } else if (query.includes("appetit") || query.includes("hunger")) {
        response = "Diese Produkte können den Appetit anregen:";
        matchedProducts = [products[0], products[4]];
      } else if (query.includes("thc")) {
        response = "Hier sind unsere THC-haltigen Produkte:";
        matchedProducts = [products[0], products[2], products[4]];
      } else if (query.includes("cbd")) {
        response = "Hier sind unsere CBD-haltigen Produkte:";
        matchedProducts = [products[1], products[3]];
      } else if (query.includes("produkt") || query.includes("empfehl") || query.includes("zeig")) {
        response = "Hier sind einige unserer beliebtesten Produkte:";
        matchedProducts = [...products];
      } else {
        response = "Basierend auf deiner Anfrage könnte ich dir folgende Produkte empfehlen:";
        const randomProducts = [...products].sort(() => 0.5 - Math.random()).slice(0, 2);
        matchedProducts = randomProducts;
      }

      setBotResponse(response);
      setRecommendedProducts(matchedProducts);
      setShowProducts(matchedProducts.length > 0);
      
      // Clear transcript after processing
      setTimeout(() => {
        setTranscript("");
      }, 2000);
      
    } catch (error) {
      console.error("Error processing message:", error);
      setBotResponse("Entschuldigung, ich konnte deine Anfrage nicht verarbeiten. Bitte versuche es später noch einmal.");
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
            <div className="flex flex-col items-center justify-center text-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-medium">Cannabis-Berater</h3>
              <p className="text-sm text-muted-foreground">Sprich mit mir über Cannabis-Produkte</p>
            </div>

            {/* Bot response section */}
            <div className="animate-fade-in">
              <div className="bg-secondary text-secondary-foreground self-start rounded-lg p-3 rounded-tl-none">
                <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
                  <Bot className="h-3 w-3" /> Berater
                  {isPlaying && (
                    <span className="inline-flex gap-1">
                      <span className="inline-block h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="inline-block h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="inline-block h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </span>
                  )}
                </div>
                {botResponse}
              </div>
            </div>

            {/* User input display */}
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

            {/* Products display */}
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

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex max-w-[85%] rounded-lg p-3 bg-secondary text-secondary-foreground self-start rounded-tl-none animate-pulse">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="p-3 border-t bg-card">
            <div className="flex flex-col gap-2">
              <div className="flex justify-center mb-1">
                <Button
                  variant={isListening ? "destructive" : "default"}
                  size="lg"
                  onClick={toggleListening}
                  className="w-full max-w-[280px] h-12 rounded-full gap-2"
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
