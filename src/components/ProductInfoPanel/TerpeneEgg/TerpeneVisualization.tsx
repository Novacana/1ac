import React from 'react';
import { cn } from "@/lib/utils";
import TerpeneShape from './TerpeneShape';
import EffectLabel from './EffectLabel';
import EggBackground from './EggBackground';
import { getTerpenePosition } from './terpeneUtils';

interface TerpeneData {
  name: string;
  value: number;
  effect: string;
  detailedEffect: string;
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

  // Updated effect labels to match the image, arranged clockwise around the egg
  const effectLabels = [
    { text: "geistig ausgleichend öffnend", angle: 60 },
    { text: "geistig entspannend", angle: 30 },
    { text: "ganzheitlich entspannend", angle: 330 },
    { text: "körperlich entspannend", angle: 300 },
    { text: "körperlich erdend ausgleichend", angle: 240 },
    { text: "körperlich ausgleichend", angle: 210 },
    { text: "ganzheitlich anregend stimulierend", angle: 150 },
    { text: "ganzheitlich anregend", angle: 120 }
  ];

  // Calculate terpene position based on its effect
  const getTerpenePositionInEgg = (terpene: string, index: number) => {
    // Get the angle for this terpene based on its effect
    const angle = getTerpenePosition(terpene);
    // Convert angle to radians for positioning
    const radian = (angle * Math.PI) / 180;
    
    // Calculate position using the angle, but keep it inside the egg shape
    // Distance from center varies slightly to avoid overlaps
    const distance = 30 + (index % 3) * 8; // 30-46% distance from center
    const x = 50 + distance * Math.cos(radian);
    const y = 50 + distance * Math.sin(radian);
    
    return {
      left: `${x}%`,
      top: `${y}%`
    };
  };

  // Determine the size of the dot based on the percentage
  const getDotSize = (percentage: number) => {
    if (percentage >= 1.0) return 26;
    if (percentage >= 0.5) return 22;
    if (percentage >= 0.3) return 18;
    return 16;
  };

  return (
    <div className="relative w-full h-[230px] flex-shrink-0 mx-auto mb-4 md:mx-0 md:mb-0">
      {/* Egg background with gradient */}
      <EggBackground isDark={isDark} />
      
      {/* Effect labels arranged around the egg */}
      {effectLabels.map((label, idx) => (
        <EffectLabel 
          key={idx} 
          text={label.text} 
          angle={label.angle} 
          isDark={isDark} 
        />
      ))}
      
      {/* Terpene shapes positioned within the egg based on their effects */}
      {terpeneData.map((terpene, index) => {
        const position = getTerpenePositionInEgg(terpene.name, index);
        const dotSize = getDotSize(terpene.value);
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
