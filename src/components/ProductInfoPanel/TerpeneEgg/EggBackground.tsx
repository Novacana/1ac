
import React from 'react';

interface EggBackgroundProps {
  isDark: boolean;
}

const EggBackground: React.FC<EggBackgroundProps> = ({ isDark }) => {
  return (
    <>
      {/* Oval egg with gradient for different effect zones - slightly larger to better contain dots */}
      <div className="absolute w-[220px] h-[260px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                    border border-border/70"
           style={{ 
             borderRadius: "50% / 60%", /* Oval form */
             background: isDark 
               ? `
                 radial-gradient(ellipse at 30% 30%, rgba(134, 239, 172, 0.4) 0%, rgba(59, 130, 246, 0.01) 70%),
                 radial-gradient(ellipse at 70% 30%, rgba(253, 224, 71, 0.4) 0%, rgba(59, 130, 246, 0.01) 70%),
                 radial-gradient(ellipse at 30% 70%, rgba(99, 102, 241, 0.4) 0%, rgba(59, 130, 246, 0.01) 70%),
                 radial-gradient(ellipse at 70% 70%, rgba(248, 113, 113, 0.4) 0%, rgba(59, 130, 246, 0.01) 70%)
               `
               : `
                 radial-gradient(ellipse at 30% 30%, rgba(134, 239, 172, 0.5) 0%, rgba(255, 255, 255, 0.01) 70%),
                 radial-gradient(ellipse at 70% 30%, rgba(253, 224, 71, 0.5) 0%, rgba(255, 255, 255, 0.01) 70%),
                 radial-gradient(ellipse at 30% 70%, rgba(99, 102, 241, 0.5) 0%, rgba(255, 255, 255, 0.01) 70%),
                 radial-gradient(ellipse at 70% 70%, rgba(248, 113, 113, 0.5) 0%, rgba(255, 255, 255, 0.01) 70%)
               `
           }}>
        {/* Internal labels removed as requested */}
      </div>
    </>
  );
};

export default EggBackground;
