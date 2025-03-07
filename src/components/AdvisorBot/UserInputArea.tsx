
import React from "react";
import { Send, Mic, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserInputAreaProps {
  userInput: string;
  setUserInput: (input: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  isListening: boolean;
  toggleListening: () => void;
  isVoiceEnabled: boolean;
  toggleVoice: () => void;
}

const UserInputArea: React.FC<UserInputAreaProps> = ({
  userInput,
  setUserInput,
  handleSendMessage,
  handleKeyPress,
  isLoading,
  isListening,
  toggleListening,
  isVoiceEnabled,
  toggleVoice,
}) => {
  return (
    <div className="p-3 border-t bg-card">
      <div className="flex flex-col gap-2">
        {/* Text input */}
        <div className="flex gap-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Schreibe eine Nachricht..."
            className="flex-1"
          />
          <Button
            disabled={!userInput.trim() || isLoading}
            onClick={handleSendMessage}
            size="icon"
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex justify-center mb-1">
          <Button
            variant={isListening ? "destructive" : "default"}
            size="sm"
            onClick={toggleListening}
            className="w-full h-10 rounded-full gap-2"
          >
            {isListening ? (
              <>
                <div className="relative">
                  <Mic className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                </div>
                <span>Zuhören... (Klick zum Stoppen)</span>
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                <span>Drücke zum Sprechen</span>
              </>
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleVoice}
            className="flex items-center gap-2 justify-center"
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
    </div>
  );
};

export default UserInputArea;
