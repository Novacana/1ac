
import React from "react";

interface EmptyProductStateProps {
  message?: string;
}

const EmptyProductState: React.FC<EmptyProductStateProps> = ({ 
  message = "Keine Produkte in dieser Kategorie gefunden" 
}) => {
  return (
    <div className="w-full h-[400px] flex items-center justify-center">
      <p className="text-xl text-muted-foreground">{message}</p>
    </div>
  );
};

export default EmptyProductState;
