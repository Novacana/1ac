
import React from 'react';

interface EggBackgroundProps {
  isDark: boolean;
}

const EggBackground: React.FC<EggBackgroundProps> = ({ isDark }) => {
  return (
    <>
      {/* Gradient background for the egg - improved dark mode appearance */}
      <div className="absolute w-[200px] h-[240px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    border border-border/50"
           style={{ 
             borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", /* egg shape */
             background: isDark 
               ? "radial-gradient(ellipse at center, rgba(255, 215, 0, 0.15) 0%, rgba(34, 139, 34, 0.1) 40%, rgba(30, 144, 255, 0.07) 80%, transparent 100%)"
               : "radial-gradient(ellipse at center, rgba(255, 255, 0, 0.1) 10%, rgba(50, 205, 50, 0.05) 40%, rgba(30, 144, 255, 0.05) 80%, transparent 100%)",
             boxShadow: isDark 
               ? "0 0 60px rgba(255, 215, 0, 0.1), inset 0 0 30px rgba(255, 255, 255, 0.05)"
               : "0 0 40px rgba(255, 255, 0, 0.1), inset 0 0 20px rgba(255, 255, 255, 0.03)"
           }}>
      </div>
      
      {/* Subtle grid pattern overlay for depth - dark mode only */}
      {isDark && (
        <div className="absolute w-[200px] h-[240px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10"
             style={{ 
               borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
               backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`,
               backgroundSize: "12px 12px"
             }}>
        </div>
      )}
    </>
  );
};

export default EggBackground;
