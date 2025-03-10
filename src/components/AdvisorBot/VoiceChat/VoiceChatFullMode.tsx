
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import VoiceChatHeader from "./VoiceChatHeader";
import VoiceChatCircle from "./VoiceChatCircle";
import VoiceChatFooter from "./VoiceChatFooter";

interface VoiceChatFullModeProps {
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

const VoiceChatFullMode: React.FC<VoiceChatFullModeProps> = (props) => {
  const [isPulsing, setIsPulsing] = useState(false);
  const { isListening, isPlaying } = props;

  useEffect(() => {
    setIsPulsing(isListening || isPlaying);
  }, [isListening, isPlaying]);

  const handleStopVoiceMode = () => {
    props.setIsSpeechInputActive(false);
    // Stop listening if active
    if (isListening) {
      props.toggleListening();
    }
    // Stop speaking if active
    if (isPlaying) {
      props.stopSpeaking();
    }
  };

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <VoiceChatHeader 
        handleStopVoiceMode={handleStopVoiceMode} 
        isFullConversationMode={props.isFullConversationMode}
        setIsFullConversationMode={props.setIsFullConversationMode}
      />
      
      <div className={cn(
        "flex flex-col items-center justify-center gap-4 p-6 rounded-lg border",
        isPulsing ? "border-primary/50" : "border-border"
      )}>
        <VoiceChatCircle {...props} isPulsing={isPulsing} />
        
        <div className="text-center">
          {isListening ? (
            <p className="font-medium text-primary animate-pulse">Ich höre zu...</p>
          ) : isPlaying ? (
            <p className="font-medium text-primary animate-pulse">Ich spreche...</p>
          ) : props.isLoading ? (
            <p className="font-medium text-muted-foreground animate-pulse">Verarbeite...</p>
          ) : (
            <p className="font-medium text-muted-foreground">Klicke zum Sprechen</p>
          )}
          
          {props.transcript && (
            <p className="mt-2 text-sm text-muted-foreground max-w-xs truncate">
              {props.transcript}
            </p>
          )}
        </div>
      </div>
      
      <VoiceChatFooter 
        isVoiceEnabled={props.isVoiceEnabled}
        toggleVoice={props.toggleVoice}
      />
    </div>
  );
};

export default VoiceChatFullMode;
