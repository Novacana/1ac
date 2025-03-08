
import React from "react";
import { cn } from "@/lib/utils";

interface PreviousImageProps {
  src: string | null;
  alt?: string;
  isVisible: boolean;
  direction: 'next' | 'prev' | null;
}

const PreviousImage: React.FC<PreviousImageProps> = ({
  src,
  alt = "Previous product",
  isVisible,
  direction
}) => {
  if (!isVisible || !src) return null;
  
  return (
    <div className={cn(
      "absolute inset-0 flex items-center justify-center bg-card/5 z-0 transition-transform duration-300",
      direction === 'next' ? '-translate-x-full' : 'translate-x-full'
    )}>
      <img 
        src={src} 
        alt={alt} 
        className="max-h-full max-w-full object-contain p-4"
        onError={(e) => {
          console.error("Failed to load previous image:", src);
          (e.target as HTMLImageElement).src = "/placeholder.svg";
        }}
      />
    </div>
  );
};

export default PreviousImage;
