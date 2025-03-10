
import React from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface InputAreaProps {
  userInput: string;
  setUserInput: (input: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({
  userInput,
  setUserInput,
  handleSendMessage,
  handleKeyPress,
  isLoading,
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
    </div>
  );
};

export default InputArea;
