
import React from 'react';
import { Circle, Diamond, Hexagon, Pentagon, Square, Triangle, Octagon } from "lucide-react";
import { cn } from "@/lib/utils";

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

// Function to get appropriate shape icon based on terpene name
const getTerpeneShapeIcon = (terpene: string, size: number) => {
  const shapes = [
    { component: Circle, terpenes: ['Myrcen', 'Limonen', 'Limonene'] },
    { component: Diamond, terpenes: ['Caryophyllen', 'Caryophyllene'] },
    { component: Hexagon, terpenes: ['Pinen', 'Pinene'] },
    { component: Pentagon, terpenes: ['Linalool'] },
    { component: Square, terpenes: ['Terpinolen', 'Terpinolene'] },
    { component: Triangle, terpenes: ['Ocimen', 'Ocimene'] },
    { component: Octagon, terpenes: ['Humulen', 'Humulene'] }
  ];
  
  const shape = shapes.find(s => s.terpenes.includes(terpene));
  const IconComponent = shape ? shape.component : Circle;
  
  return <IconComponent size={size} />;
};

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
      {/* Improved glow for dark mode */}
      <div 
        className="absolute inset-0 rounded-full blur-[8px] opacity-80"
        style={{ 
          backgroundColor: isDark ? color : `${color}70`,
          width: `${dotSize + 8}px`,
          height: `${dotSize + 8}px`
        }}
      ></div>
      
      {/* Terpene shape with drop shadow */}
      <div 
        className="relative drop-shadow-lg" 
        style={{ 
          filter: isDark 
            ? `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 5px ${color}80)` 
            : `drop-shadow(0 0 8px ${color}80)`
        }}
      >
        {getTerpeneShapeIcon(terpene.name, dotSize)}
      </div>
      
      {/* Percentage label with improved contrast */}
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
        {terpene.value}%
      </span>
      
      {/* Terpene name label always visible */}
      <div 
        className={cn(
          "absolute whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-medium shadow-lg backdrop-blur-sm",
          isDark 
            ? "bg-gray-900/80 border border-gray-700/50" 
            : "bg-background/90 border border-primary/20"
        )}
        style={{
          top: '120%',
          left: '50%',
          transform: 'translateX(-50%)',
          color: color,
        }}
      >
        {terpene.name}
      </div>
    </div>
  );
};

export default TerpeneShape;
