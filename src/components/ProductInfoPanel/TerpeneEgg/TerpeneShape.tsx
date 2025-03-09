
import React from 'react';
import { cn } from "@/lib/utils";

interface TerpeneShapeProps {
  terpene: {
    name: string;
    value: number;
    effect: string;
    detailedEffect: string;
  };
  position: {
    left: string;
    top: string;
  };
  dotSize: number;
  color: string;
  isExpanded: boolean;
  onTerpeneClick: () => void;
  isDark: boolean;
}

const TerpeneShape: React.FC<TerpeneShapeProps> = ({ 
  terpene, 
  position, 
  dotSize, 
  color, 
  isExpanded, 
  onTerpeneClick,
  isDark
}) => {
  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all duration-300"
      style={{
        left: position.left,
        top: position.top,
      }}
      onClick={onTerpeneClick}
    >
      {/* Terpene Dot with enhanced glow effect */}
      <div 
        className={cn(
          "rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
          isExpanded ? "ring-2 ring-white/80" : ""
        )}
        style={{
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          backgroundColor: color,
          boxShadow: `0 0 15px ${color}`,
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`,
        }}
      ></div>
      
      {/* Terpene Name Label - Enhanced visibility */}
      <div 
        className={cn(
          "absolute whitespace-nowrap px-2 py-1 rounded-full text-xs font-semibold transition-all duration-300",
          isDark 
            ? "bg-background/85 text-white border border-white/40 shadow-[0_0_8px_rgba(255,255,255,0.4)]" 
            : "bg-background/95 text-foreground border border-primary/40 shadow-lg",
          isExpanded ? "opacity-100 scale-100" : "opacity-100 scale-100"
        )}
        style={{
          top: `${dotSize + 4}px`,
          left: `50%`,
          transform: `translateX(-50%)`,
          backdropFilter: "blur(3px)",
        }}
      >
        <span className="font-bold">{terpene.name}</span> <span className="font-bold text-primary">{terpene.value.toFixed(1)}%</span>
      </div>

      {/* Expanded Info - Only show when expanded */}
      {isExpanded && (
        <div 
          className={cn(
            "absolute -translate-x-1/2 p-2 rounded-lg shadow-lg z-20 w-44 text-xs transition-all duration-300",
            isDark 
              ? "bg-background/95 backdrop-blur-sm border border-white/40 text-white" 
              : "bg-background/95 backdrop-blur-sm border border-primary/40 text-foreground"
          )}
          style={{
            top: `${dotSize + 30}px`,
            left: '50%',
            boxShadow: isDark 
              ? "0 0 15px rgba(255,255,255,0.3)" 
              : "0 0 15px rgba(0,0,0,0.15)",
          }}
        >
          <p className="font-semibold text-center">{terpene.name}</p>
          <p className="text-center text-primary font-bold">{terpene.value.toFixed(1)}%</p>
          <div className="border-t border-border/30 my-1 pt-1">
            <p className="font-medium">Wirkung: <span className="font-normal">{terpene.effect}</span></p>
            <p className="mt-1 text-[10px] text-muted-foreground">{terpene.detailedEffect}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerpeneShape;
