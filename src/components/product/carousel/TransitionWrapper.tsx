
import React from "react";
import { cn } from "@/lib/utils";

interface TransitionWrapperProps {
  children: React.ReactNode;
  isTransitioning: boolean;
  direction: 'next' | 'prev' | null;
  isSwiping: boolean;
  swipeDistance: number;
  className?: string;
}

const TransitionWrapper: React.FC<TransitionWrapperProps> = ({
  children,
  isTransitioning,
  direction,
  isSwiping,
  swipeDistance,
  className
}) => {
  return (
    <div 
      className={cn(
        "w-full h-full flex items-center justify-center transition-all duration-300 relative bg-card/5 backdrop-blur-sm",
        isTransitioning 
          ? cn("transform", direction === 'next' ? 'translate-x-full' : '-translate-x-full', 'animate-slide-in') 
          : 'translate-x-0',
        className
      )}
      style={{ 
        transform: isSwiping 
          ? `translateX(${swipeDistance}px)` 
          : undefined 
      }}
    >
      {children}
    </div>
  );
};

export default TransitionWrapper;
