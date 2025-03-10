
import React from 'react';
import { cn } from "@/lib/utils";
import TerpeneShape from './TerpeneShape';
import EffectLabel from './EffectLabel';
import EggBackground from './EggBackground';
import { getTerpenePosition } from './terpeneUtils';

interface TerpeneData {
  name: string;
  value: number;
  relativeValue: number; // Neu: relativer Anteil in Prozent
  effect: string;
  detailedEffect?: string; // Optional
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
  const getTerpenePositionInEgg = (terpene: string, index: number) => {
    // Get the angle for this terpene based on its effect
    const angle = getTerpenePosition(terpene);
    // Convert angle to radians for positioning
    const radian = (angle * Math.PI) / 180;
    
    // Radius variiert je nach Quadrant, um ein ovales Ei zu simulieren
    const ovalFactor = Math.abs(Math.sin(2 * radian)) * 0.2 + 0.8;
    
    // Berechne die Distanz vom Zentrum, abgestuft nach Index für Überlappungsvermeidung
    // Bei den Top-3 Terpenen halten wir sie näher am Zentrum
    const baseDistance = 35;
    const indexFactor = index < 3 ? (3 - index) * 3 : index * 2;
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
    // Größere Unterschiede in der Darstellung
    if (relativePercentage >= 50) return 40;
    if (relativePercentage >= 30) return 34;
    if (relativePercentage >= 20) return 28;
    if (relativePercentage >= 10) return 24;
    if (relativePercentage >= 5) return 20;
    return 16;
  };

  return (
    <div className="relative w-full h-[280px] flex-shrink-0 mx-auto mb-4 md:mx-0 md:mb-0">
      {/* Egg background with gradient */}
      <EggBackground isDark={isDark} />
      
      {/* Terpene shapes positioned within the egg based on their effects */}
      {sortedTerpenes.map((terpene, index) => {
        const position = getTerpenePositionInEgg(terpene.name, index);
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
