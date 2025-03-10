
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VoiceChatHeaderProps {
  handleStopVoiceMode: () => void;
  isFullConversationMode: boolean;
  setIsFullConversationMode: (mode: boolean) => void;
}

const VoiceChatHeader: React.FC<VoiceChatHeaderProps> = ({
  handleStopVoiceMode,
  isFullConversationMode,
  setIsFullConversationMode
}) => {
  return (
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
  );
};

export default VoiceChatHeader;
