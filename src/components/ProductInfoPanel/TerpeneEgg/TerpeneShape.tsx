
import React from 'react';
import { cn } from "@/lib/utils";
import { getTerpeneShapeIcon } from './terpeneUtils';

interface TerpeneShapeProps {
  terpene: {
    name: string;
    value: number;
    effect: string;
    detailedEffect?: string; // Make this optional to match TerpeneData
  };
  terpeneName: string;
  color: string;
  isDark: boolean;
  isHighlighted: boolean;
  onTerpeneClick: () => void;
}

const TerpeneShape: React.FC<TerpeneShapeProps> = ({ 
  terpene, 
  terpeneName, 
  color, 
  isDark,
  isHighlighted,
  onTerpeneClick
}) => {
  // Calculate position based on terpene type
  const getPosition = (name: string) => {
    const positions: Record<string, { top: string, left: string, size: number }> = {
      "Myrcen": { top: '30%', left: '25%', size: 22 },
      "Limonen": { top: '40%', left: '75%', size: 20 },
      "Pinen": { top: '75%', left: '65%', size: 20 },
      "Caryophyllen": { top: '60%', left: '35%', size: 18 },
      "Linalool": { top: '25%', left: '50%', size: 16 },
      "Terpinolen": { top: '50%', left: '15%', size: 18 },
      "Humulen": { top: '70%', left: '20%', size: 16 },
      "Ocimen": { top: '15%', left: '70%', size: 14 }
    };
    
    // Default position if terpene name not in mapping
    return positions[name] || { top: '50%', left: '50%', size: 18 };
  };
  
  const position = getPosition(terpeneName);
  const dotSize = position.size || 18;
  
  return (
    <div 
      className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer transition-all duration-300"
      style={{
        left: position.left,
        top: position.top,
      }}
      onClick={onTerpeneClick}
    >
      {/* Terpene Dot with shape icon */}
      <div 
        className={cn(
          "rounded-full flex items-center justify-center shadow-md transition-all duration-300",
          isHighlighted ? "ring-2 ring-white/80" : ""
        )}
        style={{
          width: `${dotSize}px`,
          height: `${dotSize}px`,
          backgroundColor: color,
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'}`,
        }}
      >
        <div className="flex items-center justify-center text-white/90" style={{ transform: 'scale(0.7)' }}>
          {getTerpeneShapeIcon(terpeneName, dotSize * 0.8)}
        </div>
      </div>
      
      {/* Terpene Name Label */}
      <div 
        className={cn(
          "absolute whitespace-nowrap px-1 py-0.5 rounded-full text-[10px] font-semibold transition-all duration-300",
          isDark 
            ? "bg-background/85 text-white border border-white/40" 
            : "bg-background/95 text-foreground border border-primary/40 shadow-sm",
        )}
        style={{
          top: `${dotSize + 4}px`,
          left: `50%`,
          transform: `translateX(-50%)`,
          backdropFilter: "blur(3px)",
        }}
      >
        <span>{terpeneName}</span>
      </div>
    </div>
  );
};

export default TerpeneShape;
