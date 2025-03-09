
import React from 'react';
import { Circle, Diamond, Hexagon, Pentagon, Square, Triangle, Octagon } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTerpeneShapeIcon } from './terpeneUtils';

interface TerpeneData {
  name: string;
  value: number;
  effect: string;
  detailedEffect: string;
}

interface TerpeneShapeProps {
  terpene: TerpeneData;
  position: { left: string; top: string };
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
      className={cn(
        "absolute flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 z-20",
        isExpanded ? "ring-2 ring-primary ring-offset-1" : ""
      )}
      style={{
        color: color,
        ...position,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={onTerpeneClick}
    >
      {/* Enhanced glow effect for better visibility */}
      <div 
        className="absolute inset-0 rounded-full blur-[10px] opacity-90"
        style={{ 
          backgroundColor: isDark ? color : `${color}80`,
          width: `${dotSize + 12}px`,
          height: `${dotSize + 12}px`
        }}
      ></div>
      
      {/* Terpene shape with enhanced drop shadow */}
      <div 
        className="relative drop-shadow-lg" 
        style={{ 
          filter: isDark 
            ? `drop-shadow(0 0 12px ${color}) drop-shadow(0 0 5px ${color}80)` 
            : `drop-shadow(0 0 8px ${color}80)`
        }}
      >
        {getTerpeneShapeIcon(terpene.name, dotSize)}
      </div>
      
      {/* Percentage label with improved contrast */}
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
        {terpene.value}%
      </span>
      
      {/* Improved terpene name label with better visibility */}
      <div 
        className={cn(
          "absolute whitespace-nowrap px-2 py-1 rounded-full text-[12px] font-bold shadow-lg",
          isDark 
            ? "bg-gray-900/80 border border-gray-700" 
            : "bg-white/90 border border-gray-200"
        )}
        style={{
          top: '120%',
          left: '50%',
          transform: 'translateX(-50%)',
          color: color,
          textShadow: isDark ? '0 0 3px rgba(0,0,0,0.8)' : 'none',
          zIndex: 30
        }}
      >
        {terpene.name}
      </div>
    </div>
  );
};

export default TerpeneShape;
