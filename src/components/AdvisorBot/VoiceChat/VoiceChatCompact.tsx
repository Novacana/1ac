
import React from "react";
import { Mic, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceChatCompactProps {
  isVoiceEnabled: boolean;
  toggleVoice: () => void;
  setIsSpeechInputActive: (active: boolean) => void;
  gdprConsent: boolean;
  toggleListening: () => void;
}

const VoiceChatCompact: React.FC<VoiceChatCompactProps> = ({
  isVoiceEnabled,
  toggleVoice,
  setIsSpeechInputActive,
  gdprConsent,
  toggleListening
}) => {
  const handleStartVoiceMode = () => {
    setIsSpeechInputActive(true);
    // Start listening automatically when entering voice mode
    if (gdprConsent) {
      toggleListening();
    }
  };

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
};

export default VoiceChatCompact;
