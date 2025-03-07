
import { useState, useRef } from "react";
import { Bot, X, Send, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ProductAdvisor = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hallo! Ich bin dein persönlicher Berater für medizinisches Cannabis. Wie kann ich dir heute helfen? Du kannst mich zu Produkten, Wirkungsweisen oder Anwendungsgebieten befragen.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const toggleAdvisor = () => {
    setIsOpen(!isOpen);
  };

  const handleSend = async () => {
    if (input.trim() === "" || isLoading) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Scroll to bottom
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    try {
      // Simulate AI response (in a real app, this would be an API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Demo responses based on user input keywords
      let botResponse = "";
      const userQuery = input.toLowerCase();
      
      if (userQuery.includes("schmerz") || userQuery.includes("pain")) {
        botResponse = "Für Schmerzpatienten empfehle ich insbesondere unsere CBD Öl Tinktur, die entzündungshemmend wirkt, oder die Medical Cannabis Flower mit 20% THC für stärkere Schmerzen. Bei chronischen Schmerzen sind regelmäßige, niedrige Dosen oft wirksamer als gelegentliche hohe Dosen.";
      } else if (userQuery.includes("schlaf") || userQuery.includes("sleep")) {
        botResponse = "Bei Schlafstörungen sind Produkte mit einem höheren THC-Gehalt wie unsere Medical Cannabis Flower oder THC Vape Cartridge besonders hilfreich. Nimm sie etwa eine Stunde vor dem Schlafengehen ein. CBD kann ebenfalls helfen, indem es Angstzustände reduziert, die Schlafprobleme verursachen könnten.";
      } else if (userQuery.includes("angst") || userQuery.includes("anxiety")) {
        botResponse = "Gegen Angstzustände wirkt CBD besonders gut. Unsere CBD Oil Tincture mit 10% CBD und minimalem THC-Gehalt ist hier optimal. Beginne mit einer niedrigen Dosis und steigere sie langsam, bis du die gewünschte Wirkung erzielst.";
      } else if (userQuery.includes("appetit") || userQuery.includes("hunger")) {
        botResponse = "THC-haltige Produkte wie unsere Medical Cannabis Flower oder Cannabis-Infused Gummies können den Appetit anregen. Dies ist besonders hilfreich für Patienten mit krankheitsbedingtem Appetitsverlust.";
      } else if (userQuery.includes("dosierung") || userQuery.includes("dose")) {
        botResponse = "Die optimale Dosierung ist individuell verschieden. Beginne immer mit einer niedrigen Dosis (Start low, go slow). Bei Ölen wie unserer CBD Tincture starte mit 1-2 Tropfen, bei Edibles wie den Gummies mit einer halben Portion. Steigere die Dosis langsam, bis du die gewünschte Wirkung erzielst.";
      } else if (userQuery.includes("unterschied") || userQuery.includes("difference") || userQuery.includes("thc") || userQuery.includes("cbd")) {
        botResponse = "THC und CBD sind die bekanntesten Cannabinoide. THC hat psychoaktive Wirkungen und hilft bei Schmerzen, Übelkeit und Appetitlosigkeit. CBD ist nicht psychoaktiv, wirkt aber entzündungshemmend, angstlösend und krampflösend. Produkte mit hohem CBD-Gehalt wie unsere CBD Oil Tincture verursachen kein High, während THC-reiche Produkte wie unsere Medical Cannabis Flower psychoaktive Effekte haben.";
      } else if (userQuery.includes("vape") || userQuery.includes("rauchen") || userQuery.includes("smoke")) {
        botResponse = "Vaping, wie mit unserer THC Vape Cartridge, bietet eine schnelle Wirkung innerhalb von Minuten, da die Wirkstoffe direkt über die Lunge aufgenommen werden. Die Wirkung hält etwa 2-3 Stunden an. Im Vergleich dazu setzen Edibles wie unsere Cannabis-Infused Gummies langsamer ein (30-90 Minuten), wirken aber länger (4-6 Stunden).";
      } else if (userQuery.includes("nebenwirkung") || userQuery.includes("side effect")) {
        botResponse = "Mögliche Nebenwirkungen, besonders bei THC-haltigen Produkten, können Mundtrockenheit, rote Augen, erhöhter Herzschlag, Schwindel oder Paranoia umfassen. Beginne mit einer niedrigen Dosis und steigere langsam. Bei CBD sind Nebenwirkungen selten und mild, können aber Müdigkeit, Durchfall oder Appetitveränderungen einschließen.";
      } else if (userQuery.includes("legal") || userQuery.includes("erlaubt") || userQuery.includes("rezept")) {
        botResponse = "Alle unsere Produkte sind für medizinische Zwecke legal, wenn sie von einem Arzt verschrieben wurden. Dr. Ansay stellt sicher, dass alle rechtlichen Anforderungen erfüllt sind. Bei Fragen zur Verschreibung kannst du direkt einen unserer Ärzte konsultieren.";
      } else {
        botResponse = "Danke für deine Frage! Basierend auf deinen Bedürfnissen empfehle ich dir einen Blick auf unsere Medical Cannabis Flower mit 20% THC für starke therapeutische Wirkung oder die CBD Oil Tincture mit 10% CBD für eine nicht-psychoaktive Alternative. Möchtest du mehr Details zu einem bestimmten Produkt oder Anwendungsgebiet erfahren?";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: botResponse }]);
    } catch (error) {
      console.error("Error processing message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Entschuldigung, ich konnte deine Anfrage nicht verarbeiten. Bitte versuche es später noch einmal." },
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
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

      <div
        className={cn(
          "fixed bottom-20 right-4 w-80 md:w-96 z-40 transition-all duration-300 transform",
          isOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
        )}
      >
        <Card className="border shadow-lg overflow-hidden flex flex-col h-[500px]">
          <div className="p-3 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="font-medium">Cannabis-Berater</span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleAdvisor} className="h-8 w-8 text-primary-foreground">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex flex-col max-w-[85%] rounded-lg p-3 animate-slide-up", 
                  message.role === "assistant" 
                    ? "bg-secondary text-secondary-foreground self-start rounded-tl-none" 
                    : "bg-primary text-primary-foreground self-end rounded-br-none"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
                  {message.role === "assistant" ? (
                    <>
                      <Bot className="h-3 w-3" /> Berater
                    </>
                  ) : (
                    <>
                      <User className="h-3 w-3" /> Du
                    </>
                  )}
                </div>
                {message.content}
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
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Frage zu Cannabis-Produkten..."
                className="min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
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
