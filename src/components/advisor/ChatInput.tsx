
import { useState } from "react";
import { Send, Loader2, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput = ({ onSend, isLoading }: ChatInputProps) => {
  const [input, setInput] = useState("");
  
  const { isListening, toggleListening } = useSpeechRecognition({
    onFinalTranscript: (transcript) => {
      setInput(transcript);
      if (!isLoading) {
        onSend(transcript);
      }
    },
    onInterimTranscript: (transcript) => {
      setInput(transcript);
    },
  });

  const handleSend = () => {
    if (input.trim() === "" || isLoading) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 border-t bg-card">
      <div className="flex items-center justify-center mb-2">
        <div className="flex gap-2 w-full max-w-[240px] justify-center">
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
  );
};
