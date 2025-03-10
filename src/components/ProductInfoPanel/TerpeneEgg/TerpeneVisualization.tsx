
import React from 'react';
import { cn } from "@/lib/utils";
import TerpeneShape from './TerpeneShape';
import EggBackground from './EggBackground';
import { getTerpenePosition } from './terpeneUtils';

interface TerpeneData {
  name: string;
  value: number;
  relativeValue: number;
  effect: string;
  detailedEffect?: string;
}

interface TerpeneVisualizationProps {
  terpeneData: TerpeneData[];
  expandedTerpene: string | null;
  onTerpeneClick: (terpeneName: string) => void;
  isDark: boolean;
}

const TerpeneVisualization: React.FC<TerpeneVisualizationProps> = ({ 
  terpeneData, 
  expandedTerpene, 
  onTerpeneClick,
  isDark 
}) => {
  // Vibrant color palette for better visibility
  const colors = [
    '#9333EA', // Vivid purple
    '#EC4899', // Pink
    '#F97316', // Orange
    '#0EA5E9', // Sky blue
    '#10B981', // Emerald
    '#EF4444', // Red
    '#F59E0B'  // Amber
  ];

  // Calculate terpene position based on its effect
  const getTerpenePositionInEgg = (terpene: string, index: number, totalTerpenes: number) => {
    // Get the angle for this terpene based on its effect
    const angle = getTerpenePosition(terpene);
    // Add a slight offset based on index to prevent overlapping for terpenes with similar effects
    const offsetAngle = angle + (index % 3 - 1) * 8;
    // Convert angle to radians for positioning
    const radian = (offsetAngle * Math.PI) / 180;
    
    // Radius variiert je nach Quadrant, um ein ovales Ei zu simulieren
    const ovalFactor = Math.abs(Math.sin(2 * radian)) * 0.2 + 0.8;
    
    // Berechne die Distanz vom Zentrum, abgestuft nach Index für Überlappungsvermeidung
    // Distribute terpenes based on their relative size
    const baseDistance = 35;
    const indexFactor = index < 3 ? (3 - index) * 3 : Math.min(index, totalTerpenes - 1) * 1.5;
    const distance = baseDistance - indexFactor;
    
    // Berechne x und y Koordinaten
    const x = 50 + distance * ovalFactor * Math.cos(radian);
    const y = 50 + distance * Math.sin(radian);
    
    return {
      left: `${x}%`,
      top: `${y}%`
    };
  };

  // Sortiere Terpene nach relativem Anteil absteigend
  const sortedTerpenes = [...terpeneData].sort((a, b) => b.relativeValue - a.relativeValue);

  // Determine the size of the dot based on the relative percentage
  const getDotSize = (relativePercentage: number) => {
    // Größere Unterschiede in der Darstellung für bessere Differenzierung
    if (relativePercentage >= 50) return 44;
    if (relativePercentage >= 30) return 38;
    if (relativePercentage >= 20) return 32;
    if (relativePercentage >= 10) return 26;
    if (relativePercentage >= 5) return 22;
    return 18;
  };

  // Effect labels that should be displayed around the egg
  const effectLabels = [
    { text: "körperlich erdend ausgleichend", position: { top: '0%', left: '50%' } },
    { text: "körperlich entspannend", position: { top: '0%', left: '80%' } },
    { text: "körperlich ausgleichend", position: { top: '30%', left: '0%' } },
    { text: "ganzheitlich entspannend", position: { top: '30%', left: '100%' } },
    { text: "ganzheitlich anregend stimulierend", position: { top: '70%', left: '0%' } },
    { text: "geistig entspannend", position: { top: '70%', left: '100%' } },
    { text: "ganzheitlich anregend", position: { top: '100%', left: '30%' } },
    { text: "geistig ausgleichend öffnend", position: { top: '100%', left: '70%' } },
  ];

  return (
    <div className="relative w-full h-[280px] flex-shrink-0 mx-auto">
      {/* Egg background with gradient */}
      <EggBackground isDark={isDark} />
      
      {/* Effect labels around the egg */}
      {effectLabels.map((label, index) => (
        <div 
          key={`effect-${index}`}
          className={cn(
            "absolute transform -translate-x-1/2 text-xs px-3 py-1 rounded-full",
            isDark 
              ? "bg-gray-800/90 text-white" 
              : "bg-gray-100/90 text-gray-800",
            "border border-gray-500/20"
          )}
          style={{
            top: label.position.top,
            left: label.position.left,
            maxWidth: '160px',
            textAlign: 'center',
            zIndex: 5
          }}
        >
          {label.text}
        </div>
      ))}
      
      {/* Terpene shapes positioned within the egg based on their effects */}
      {sortedTerpenes.map((terpene, index) => {
        const position = getTerpenePositionInEgg(terpene.name, index, sortedTerpenes.length);
        const dotSize = getDotSize(terpene.relativeValue);
        const color = colors[index % colors.length];
        
        return (
          <TerpeneShape 
            key={terpene.name}
            terpene={terpene}
            position={position}
            dotSize={dotSize}
            color={color}
            isExpanded={expandedTerpene === terpene.name}
            onTerpeneClick={() => onTerpeneClick(terpene.name)}
            isDark={isDark}
          />
        );
      })}
    </div>
  );
};

export default TerpeneVisualization;
