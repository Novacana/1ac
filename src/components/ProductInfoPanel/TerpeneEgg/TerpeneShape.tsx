
import React from 'react';
import { cn } from "@/lib/utils";

interface TerpeneShapeProps {
  terpene: {
    name: string;
    value: number;
    relativeValue: number;
    effect: string;
    detailedEffect?: string;
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
      {/* Terpene Dot with relative size */}
      <div 
        className={cn(
          "rounded-full flex items-center justify-center shadow-md transition-all duration-300",
          isExpanded ? "ring-2 ring-white/80" : ""
        )}
        style={{
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          backgroundColor: color,
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`,
        }}
      >
        {/* Leave dot empty */}
      </div>
      
      {/* Label for terpene name and percentage */}
      <div 
        className={cn(
          "absolute whitespace-nowrap px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all duration-300 z-20",
          isDark 
            ? "bg-gray-800/95 text-white border border-white/30" 
            : "bg-background/95 text-foreground border border-primary/30 shadow-sm",
          isExpanded ? "scale-105" : "scale-100"
        )}
        style={{
          top: `${dotSize + 4}px`,
          left: `50%`,
          transform: `translateX(-50%)`,
          backdropFilter: "blur(3px)",
        }}
      >
        {terpene.name} <span className="text-primary">{terpene.value.toFixed(1)}%</span>
      </div>

      {/* Expanded Info - Only show when expanded */}
      {isExpanded && (
        <div 
          className={cn(
            "absolute -translate-x-1/2 p-2 rounded-lg shadow-md z-30 w-44 text-xs transition-all duration-300",
            isDark 
              ? "bg-background/95 backdrop-blur-sm border border-white/40 text-white" 
              : "bg-background/95 backdrop-blur-sm border border-primary/40 text-foreground"
          )}
          style={{
            top: `${dotSize + 30}px`,
            left: '50%',
          }}
        >
          <p className="font-semibold text-center">{terpene.name}</p>
          <div className="flex justify-center gap-2 items-center">
            <p className="text-center text-primary font-bold">{terpene.value.toFixed(1)}%</p>
            <p className="text-center text-foreground/70 font-medium">({terpene.relativeValue}% Anteil)</p>
          </div>
          <div className="border-t border-border/30 my-1 pt-1">
            <p className="font-medium">Wirkung: <span className="font-normal">{terpene.effect}</span></p>
            {terpene.detailedEffect && (
              <p className="mt-1 text-[10px] text-muted-foreground">{terpene.detailedEffect}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TerpeneShape;
