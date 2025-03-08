
import React from "react";
import { Bot, X, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdvisorHeaderProps {
  isVoiceEnabled: boolean;
  toggleVoice: () => void;
  toggleAdvisor: () => void;
}

const AdvisorHeader: React.FC<AdvisorHeaderProps> = ({
  isVoiceEnabled,
  toggleVoice,
  toggleAdvisor
}) => {
  return (
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
  );
}

export default AdvisorHeader;
