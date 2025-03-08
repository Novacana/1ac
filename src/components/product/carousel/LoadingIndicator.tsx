
import React from "react";
import { cn } from "@/lib/utils";

interface LoadingIndicatorProps {
  isVisible: boolean;
  className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  isVisible,
  className
}) => {
  if (!isVisible) return null;
  
  return (
    <div className={cn(
      "absolute inset-0 flex items-center justify-center bg-card/10 backdrop-blur-sm z-10",
      className
    )}>
      <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
    </div>
  );
};

export default LoadingIndicator;
