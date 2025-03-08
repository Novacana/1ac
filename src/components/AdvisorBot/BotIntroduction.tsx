
import React from "react";
import { Bot } from "lucide-react";

const BotIntroduction: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center mb-4">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
        <Bot className="h-8 w-8 text-primary" />
      </div>
      <h3 className="font-medium">Cannabis-Berater (KI)</h3>
      <p className="text-sm text-muted-foreground">Sprich mit mir über Cannabis-Produkte</p>
    </div>
  );
}

export default BotIntroduction;
