
import { Bot, User, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useVoice } from "@/contexts/VoiceContext";
import { type Message } from "@/types/advisor";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { isVoiceEnabled, isPlaying, speakMessage } = useVoice();
  const isAssistant = message.role === "assistant";

  return (
    <div 
      className={cn(
        "flex flex-col max-w-[85%] rounded-lg p-3", 
        isAssistant 
          ? "bg-secondary text-secondary-foreground self-start rounded-tl-none" 
          : "bg-primary text-primary-foreground self-end rounded-br-none"
      )}
    >
      <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
        {isAssistant ? (
          <>
            <Bot className="h-3 w-3" /> Berater
            {isVoiceEnabled && message.messageId && (
              <Button
                variant="outline"
                size="sm"
                className="h-5 py-0 px-1.5 ml-1 text-xs flex items-center gap-1"
                onClick={() => speakMessage(message.content, message.messageId || "")}
                title={isPlaying ? "Pausieren" : "Vorlesen"}
              >
                {isPlaying ? (
                  <>
                    <span className="inline-block h-2 w-2 bg-current rounded-full animate-pulse"></span>
                    <span className="text-xs">Pause</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-3 w-3" />
                    <span className="text-xs">Vorlesen</span>
                  </>
                )}
              </Button>
            )}
          </>
        ) : (
          <>
            <User className="h-3 w-3" /> Du
          </>
        )}
      </div>
      {message.content}
    </div>
  );
};
