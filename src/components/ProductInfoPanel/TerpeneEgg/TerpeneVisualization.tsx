
import React from "react";
import { cn } from "@/lib/utils";
import EggBackground from "./EggBackground";
import TerpeneShape from "./TerpeneShape";
import EffectLabel from "./EffectLabel";

interface TerpeneData {
  name: string;
  value: number;
  effect: string;
}

interface TerpeneVisualizationProps {
  terpeneData: TerpeneData[];
  expandedTerpene: string | null;
  onTerpeneClick: (terpeneName: string) => void;
  isDark: boolean;
}

const TerpeneVisualization: React.FC<TerpeneVisualizationProps> = ({
  terpeneData,
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

  return (
    <div className={cn(
      "relative aspect-square w-full max-w-[220px] mx-auto",
      "rounded-full overflow-hidden"
    )}>
      {/* Background egg shape */}
      <EggBackground isDark={isDark} />
      
      {/* Terpene shapes positioned at angles on the egg */}
      {terpeneData.map((terpene, index) => (
        <TerpeneShape 
          key={index}
          terpene={terpene}
          terpeneName={terpene.name}
          color={colors[index % colors.length]}
          isDark={isDark}
          isHighlighted={false} // No longer highlighting expanded terpenes
          onTerpeneClick={() => {}} // Empty function since we removed click functionality
        />
      ))}
      
      {/* Effect zone labels - static labels around the egg */}
      <EffectLabel position="top" label="Geist" isDark={isDark} />
      <EffectLabel position="right" label="Energie" isDark={isDark} />
      <EffectLabel position="bottom" label="Körper" isDark={isDark} />
      <EffectLabel position="left" label="Ruhe" isDark={isDark} />
    </div>
  );
};

export default TerpeneVisualization;
