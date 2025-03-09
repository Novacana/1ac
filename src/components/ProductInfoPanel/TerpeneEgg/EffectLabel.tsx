
import React from 'react';
import { cn } from "@/lib/utils";

interface EffectLabelProps {
  text: string;
  angle: number;
  isDark: boolean;
}

const EffectLabel: React.FC<EffectLabelProps> = ({ text, angle, isDark }) => {
  const radian = (angle * Math.PI) / 180;
  
  // Calculate position for each label - outside the egg
  const left = 50 + 55 * Math.cos(radian);
  const top = 50 + 60 * Math.sin(radian);
  
  return (
    <div
      className={cn(
        "absolute text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap z-10",
        isDark 
          ? "bg-gray-900/90 text-gray-100 backdrop-blur-sm"
          : "bg-white/90 text-gray-800 shadow-sm"
      )}
      style={{
        left: `${left}%`,
        top: `${top}%`,
        transform: "translate(-50%, -50%)",
        textShadow: isDark ? "0px 0px 4px rgba(255,255,255,0.2)" : "none",
        boxShadow: isDark 
          ? "0 2px 10px rgba(0, 0, 0, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1)"
          : "0 2px 8px rgba(0,0,0,0.1)"
      }}
    >
      {text}
    </div>
  );
};

export default EffectLabel;
