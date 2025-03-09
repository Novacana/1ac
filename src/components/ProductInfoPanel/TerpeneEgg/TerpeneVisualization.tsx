
import React from 'react';
import { cn } from "@/lib/utils";
import { TerpeneShape } from './TerpeneShape';
import { EffectLabel } from './EffectLabel';
import { EggBackground } from './EggBackground';

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

  // Define terpene positions within the egg
  const getTerpenePositionInEgg = (index: number) => {
    // Calculate random-looking but fixed positions within the egg shape
    // These positions are designed to spread out within the egg
    const positions = [
      { x: 35, y: 35 }, // top left area
      { x: 65, y: 35 }, // top right area
      { x: 50, y: 50 }, // center
      { x: 35, y: 65 }, // bottom left
      { x: 65, y: 65 }, // bottom right
      { x: 50, y: 30 }, // top center
      { x: 50, y: 70 }, // bottom center
      { x: 25, y: 50 }, // left middle
      { x: 75, y: 50 }, // right middle
    ];
    
    // Get a position from our preset positions, wrapped around if needed
    const pos = positions[index % positions.length];
    
    return {
      left: `${pos.x}%`,
      top: `${pos.y}%`
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
    <div className="relative h-[280px] w-[240px] flex-shrink-0 mx-auto mb-4 md:mx-0">
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
      
      {/* Terpene shapes positioned within the egg */}
      {terpeneData.map((terpene, index) => {
        const position = getTerpenePositionInEgg(index);
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

      {/* Add color-coded circles matching the image */}
      <div className="absolute top-[50%] left-[40%] w-[60px] h-[60px] rounded-full bg-yellow-400/90" 
           style={{ transform: 'translate(-50%, -50%)' }}></div>
      <div className="absolute top-[40%] right-[35%] w-[15px] h-[15px] rounded-full bg-green-600/90"
           style={{ transform: 'translate(50%, -50%)' }}></div>
      <div className="absolute bottom-[40%] right-[30%] w-[20px] h-[20px] rounded-full bg-blue-600/90"
           style={{ transform: 'translate(50%, 50%)' }}></div>
      <div className="absolute bottom-[35%] left-[35%] w-[10px] h-[10px] rounded-full bg-red-800/90"
           style={{ transform: 'translate(-50%, 50%)' }}></div>
    </div>
  );
};

export default TerpeneVisualization;
