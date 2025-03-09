
import React from 'react';

interface EggBackgroundProps {
  isDark: boolean;
}

const EggBackground: React.FC<EggBackgroundProps> = ({ isDark }) => {
  return (
    <>
      {/* Enhanced gradient background for the egg */}
      <div className="absolute w-[200px] h-[240px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    border border-border/50"
           style={{ 
             borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", /* egg shape */
             background: isDark 
               ? "radial-gradient(ellipse at center, rgba(255, 215, 0, 0.3) 0%, rgba(34, 139, 34, 0.2) 40%, rgba(30, 144, 255, 0.15) 80%, transparent 100%)"
               : "radial-gradient(ellipse at center, rgba(255, 255, 0, 0.25) 10%, rgba(50, 205, 50, 0.2) 40%, rgba(30, 144, 255, 0.15) 80%, transparent 100%)",
             boxShadow: isDark 
               ? "0 0 60px rgba(255, 215, 0, 0.25), inset 0 0 40px rgba(255, 255, 255, 0.1)"
               : "0 0 40px rgba(255, 255, 0, 0.2), inset 0 0 30px rgba(255, 255, 255, 0.1)"
           }}>
      </div>
    </>
  );
};

export default EggBackground;
