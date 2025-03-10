
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
    
    // Add a larger offset based on index to prevent overlapping
    const offsetAngle = angle + (index % 3 - 1) * 15;
    
    // Convert angle to radians for positioning
    const radian = (offsetAngle * Math.PI) / 180;
    
    // Radius varies based on quadrant to simulate an oval egg
    const ovalFactor = Math.abs(Math.sin(2 * radian)) * 0.2 + 0.8;
    
    // Calculate distance from center
    // Adjust distance based on terpene count to avoid overcrowding
    const baseDistance = 35;
    const distanceFactor = totalTerpenes <= 3 ? 1 : totalTerpenes <= 5 ? 0.9 : 0.85;
    const distance = baseDistance * distanceFactor;
    
    // Calculate x and y coordinates
    const x = 50 + distance * ovalFactor * Math.cos(radian);
    const y = 50 + distance * Math.sin(radian);
    
    return {
      left: `${x}%`,
      top: `${y}%`
    };
  };

  // Sort terpenes by relative proportion in descending order
  const sortedTerpenes = [...terpeneData].sort((a, b) => b.relativeValue - a.relativeValue);

  // Determine the size of the dot based on the relative percentage
  const getDotSize = (relativePercentage: number) => {
    // More pronounced differences in size for better visual hierarchy
    if (relativePercentage >= 50) return 42;
    if (relativePercentage >= 30) return 36;
    if (relativePercentage >= 20) return 30;
    if (relativePercentage >= 10) return 24;
    if (relativePercentage >= 5) return 20;
    return 16;
  };

  // Effect labels that should be displayed around the egg
  const effectLabels = [
    { text: "körperlich erdend ausgleichend", position: { top: '-5%', left: '50%' } },
    { text: "körperlich entspannend", position: { top: '-5%', left: '85%' } },
    { text: "körperlich ausgleichend", position: { top: '25%', left: '-5%' } },
    { text: "ganzheitlich entspannend", position: { top: '25%', left: '105%' } },
    { text: "ganzheitlich anregend stimulierend", position: { top: '75%', left: '-5%' } },
    { text: "geistig entspannend", position: { top: '75%', left: '105%' } },
    { text: "ganzheitlich anregend", position: { top: '105%', left: '30%' } },
    { text: "geistig ausgleichend öffnend", position: { top: '105%', left: '70%' } },
  ];

  return (
    <div className="relative w-full h-[340px] flex-shrink-0 mx-auto">
      {/* Increased height for better spacing */}
      
      {/* Egg background with gradient */}
      <EggBackground isDark={isDark} />
      
      {/* Effect labels around the egg - positioned farther away from the egg */}
      {effectLabels.map((label, index) => (
        <div 
          key={`effect-${index}`}
          className={cn(
            "absolute transform -translate-x-1/2 text-xs px-2 py-0.5 rounded-full",
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
