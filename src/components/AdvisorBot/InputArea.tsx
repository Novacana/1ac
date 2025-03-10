
import React from "react";
import { Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface InputAreaProps {
  userInput: string;
  setUserInput: (input: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  isVoiceEnabled?: boolean;
  gdprConsent?: boolean;
  toggleVoiceMode?: () => void;
}

const InputArea: React.FC<InputAreaProps> = ({
  userInput,
  setUserInput,
  handleSendMessage,
  handleKeyPress,
  isLoading,
  isVoiceEnabled = false,
  gdprConsent = false,
  toggleVoiceMode
}) => {
  return (
    <div className="p-3 border-t bg-card">
      <div className="flex gap-2">
        <Input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Schreibe eine Nachricht..."
          className="flex-1"
          data-gdpr-input="user-message"
        />
        
        <Button
          disabled={!userInput.trim() || isLoading}
          onClick={handleSendMessage}
          size="icon"
          className="shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
        
        {toggleVoiceMode && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggleVoiceMode}
                  size="icon"
                  variant="outline"
                  className="shrink-0"
                  disabled={!gdprConsent}
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {gdprConsent 
                  ? "Zur Sprachunterhaltung wechseln" 
                  : "DSGVO-Zustimmung erforderlich für Spracherkennung"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      {!gdprConsent && toggleVoiceMode && (
        <p className="text-xs text-muted-foreground mt-1">
          Hinweis: DSGVO-Zustimmung erforderlich für Sprachfunktionen
        </p>
      )}
    </div>
  );
};

export default InputArea;
