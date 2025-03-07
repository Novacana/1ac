
import React from "react";

interface EmptyProductStateProps {
  message?: string;
}

const EmptyProductState: React.FC<EmptyProductStateProps> = ({ 
  message = "No products found" 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-6 text-center bg-muted/10 rounded-lg border border-border/50">
      <div className="text-4xl mb-4">🌿</div>
      <h3 className="text-lg font-medium mb-2">{message}</h3>
      <p className="text-muted-foreground text-sm">
        Try selecting another category
      </p>
    </div>
  );
};

export default EmptyProductState;
