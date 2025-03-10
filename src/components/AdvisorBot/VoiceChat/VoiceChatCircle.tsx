
import React from "react";
import { Mic, MicOff, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VoiceChatCircleProps {
  isListening: boolean;
  toggleListening: () => void;
  isPlaying: boolean;
  stopSpeaking: () => void;
  isLoading: boolean;
  gdprConsent: boolean;
  isPulsing: boolean;
}

const VoiceChatCircle: React.FC<VoiceChatCircleProps> = ({
  isListening,
  toggleListening,
  isPlaying,
  stopSpeaking,
  isLoading,
  gdprConsent,
  isPulsing
}) => {
  return (
    <div className={cn(
      "relative rounded-full w-24 h-24 flex items-center justify-center border-4",
      isPulsing ? "border-primary animate-pulse" : "border-muted"
    )}>
      {isListening ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-20 w-20 rounded-full"
          onClick={toggleListening}
        >
          <MicOff className={cn(
            "h-8 w-8",
            isPulsing ? "text-primary" : "text-muted-foreground"
          )} />
        </Button>
      ) : isPlaying ? (
        <Button
          variant="ghost"
          size="icon"
          className="h-20 w-20 rounded-full"
          onClick={stopSpeaking}
        >
          <StopCircle className={cn(
            "h-8 w-8",
            isPulsing ? "text-primary" : "text-muted-foreground"
          )} />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-20 w-20 rounded-full"
          onClick={toggleListening}
          disabled={isLoading || !gdprConsent}
        >
          <Mic className={cn(
            "h-8 w-8",
            isLoading ? "text-muted-foreground animate-pulse" : "text-primary"
          )} />
        </Button>
      )}
      
      {isPulsing && (
        <>
          <span className="absolute inset-0 rounded-full bg-primary/10 animate-ping"></span>
          <span className="absolute inset-0 rounded-full bg-primary/5 animate-pulse"></span>
        </>
      )}
    </div>
  );
};

export default VoiceChatCircle;
