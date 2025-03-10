
import React from 'react';

interface EggBackgroundProps {
  isDark: boolean;
}

const EggBackground: React.FC<EggBackgroundProps> = ({ isDark }) => {
  return (
    <>
      {/* Egg background without glow effect */}
      <div className="absolute w-[200px] h-[240px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    border border-border/70"
           style={{ 
             borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", /* egg shape */
             background: isDark 
               ? "radial-gradient(ellipse at center, rgba(255, 215, 0, 0.6) 0%, rgba(34, 139, 34, 0.5) 40%, rgba(30, 144, 255, 0.4) 80%, transparent 100%)"
               : "radial-gradient(ellipse at center, rgba(255, 255, 0, 0.55) 10%, rgba(50, 205, 50, 0.5) 40%, rgba(30, 144, 255, 0.4) 80%, transparent 100%)"
           }}>
      </div>
    </>
  );
};

export default EggBackground;
