
import React from "react";
import { Bot, User } from "lucide-react";
import { Message } from "./types";

interface ConversationMessageProps {
  message: Message;
  index: number;
  isPlaying: boolean;
  isLastMessage: boolean;
}

const ConversationMessage: React.FC<ConversationMessageProps> = ({
  message,
  index,
  isPlaying,
  isLastMessage,
}) => {
  if (message.role === 'user') {
    return (
      <div key={index} className="animate-fade-in ml-auto">
        <div className="bg-primary text-primary-foreground self-end rounded-lg p-3 rounded-br-none">
          <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
            <User className="h-3 w-3" /> Du
          </div>
          {message.content}
        </div>
      </div>
    );
  } else {
    return (
      <div key={index} className="animate-fade-in">
        <div className="bg-secondary text-secondary-foreground self-start rounded-lg p-3 rounded-tl-none">
          <div className="flex items-center gap-2 mb-1 text-xs opacity-70">
            <Bot className="h-3 w-3" /> Berater
            {isPlaying && isLastMessage && (
              <span className="inline-flex gap-1">
                <span className="inline-block h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="inline-block h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="inline-block h-1.5 w-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </span>
            )}
          </div>
          {message.content}
        </div>
      </div>
    );
  }
};

export default ConversationMessage;
