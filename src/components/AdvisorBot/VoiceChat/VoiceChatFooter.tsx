
import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VoiceChatFooterProps {
  isVoiceEnabled: boolean;
  toggleVoice: () => void;
}

const VoiceChatFooter: React.FC<VoiceChatFooterProps> = ({
  isVoiceEnabled,
  toggleVoice
}) => {
  return (
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
  );
};

export default VoiceChatFooter;
