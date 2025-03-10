
import React, { useState, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VoiceChatProps {
  isListening: boolean;
  toggleListening: () => void;
  isPlaying: boolean;
  stopSpeaking: () => void;
  transcript: string;
  isLoading: boolean;
  gdprConsent: boolean;
  isVoiceEnabled: boolean;
  toggleVoice: () => void;
  isSpeechInputActive: boolean;
  setIsSpeechInputActive: (active: boolean) => void;
  isFullConversationMode: boolean;
  setIsFullConversationMode: (mode: boolean) => void;
}

const VoiceChat: React.FC<VoiceChatProps> = ({
  isListening,
  toggleListening,
  isPlaying,
  stopSpeaking,
  transcript,
  isLoading,
  gdprConsent,
  isVoiceEnabled,
  toggleVoice,
  isSpeechInputActive,
  setIsSpeechInputActive,
  isFullConversationMode,
  setIsFullConversationMode
}) => {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    setIsPulsing(isListening || isPlaying);
  }, [isListening, isPlaying]);

  const handleStartVoiceMode = () => {
    setIsSpeechInputActive(true);
    // Start listening automatically when entering voice mode
    if (!isListening && gdprConsent) {
      toggleListening();
    }
  };

  const handleStopVoiceMode = () => {
    setIsSpeechInputActive(false);
    // Stop listening if active
    if (isListening) {
      toggleListening();
    }
    // Stop speaking if active
    if (isPlaying) {
      stopSpeaking();
    }
  };

  if (!isSpeechInputActive) {
    return (
      <div className="flex flex-col gap-2 animate-fade-in">
        <Button
          onClick={handleStartVoiceMode}
          className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 py-6 relative overflow-hidden"
        >
          <Mic className="h-5 w-5" />
          <span>Sprachunterhaltung starten</span>
        </Button>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground">Sprachunterhaltung mit Deinem Berater</span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleVoice}
            className="h-7 px-2"
          >
            {isVoiceEnabled ? (
              <Volume2 className="h-3 w-3" />
            ) : (
              <VolumeX className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleStopVoiceMode}
          className="h-8"
        >
          <span>Zurück zum Text</span>
        </Button>
        
        <Badge 
          variant={isFullConversationMode ? "default" : "secondary"} 
          className={cn("cursor-pointer", isFullConversationMode && "bg-green-500")}
          onClick={() => setIsFullConversationMode(!isFullConversationMode)}
        >
          {isFullConversationMode ? "Vollgespräch" : "Einfacher Modus"}
        </Badge>
      </div>
      
      <div className={cn(
        "flex flex-col items-center justify-center gap-4 p-6 rounded-lg border",
        isPulsing ? "border-primary/50" : "border-border"
      )}>
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
        
        <div className="text-center">
          {isListening ? (
            <p className="font-medium text-primary animate-pulse">Ich höre zu...</p>
          ) : isPlaying ? (
            <p className="font-medium text-primary animate-pulse">Ich spreche...</p>
          ) : isLoading ? (
            <p className="font-medium text-muted-foreground animate-pulse">Verarbeite...</p>
          ) : (
            <p className="font-medium text-muted-foreground">Klicke zum Sprechen</p>
          )}
          
          {transcript && (
            <p className="mt-2 text-sm text-muted-foreground max-w-xs truncate">
              {transcript}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleVoice}
          className="flex items-center gap-2"
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
  );
};

export default VoiceChat;
