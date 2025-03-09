
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Circle, Diamond, Hexagon, Pentagon, Square, Triangle, Octagon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTheme } from "@/components/ThemeProvider";
import { parsePercentage, getTerpeneEffect, getTerpeneDetailedEffect, getTerpeneColor } from "./utils";

interface TerpeneEggProps {
  product: Product;
}

// Function to get appropriate shape icon based on terpene name
const getTerpeneShapeIcon = (terpene: string, size: number) => {
  const shapes = [
    { component: Circle, terpenes: ['Myrcen', 'Limonen', 'Limonene'] },
    { component: Diamond, terpenes: ['Caryophyllen', 'Caryophyllene'] },
    { component: Hexagon, terpenes: ['Pinen', 'Pinene'] },
    { component: Pentagon, terpenes: ['Linalool'] },
    { component: Square, terpenes: ['Terpinolen', 'Terpinolene'] },
    { component: Triangle, terpenes: ['Ocimen', 'Ocimene'] },
    { component: Octagon, terpenes: ['Humulen', 'Humulene'] }
  ];
  
  const shape = shapes.find(s => s.terpenes.includes(terpene));
  const IconComponent = shape ? shape.component : Circle;
  
  return <IconComponent size={size} />;
};

const TerpeneEgg: React.FC<TerpeneEggProps> = ({ product }) => {
  const isMobile = useIsMobile();
  const [expandedTerpene, setExpandedTerpene] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  if (!product.terpenes || product.terpenes.length === 0) return null;

  // Create terpene data
  const terpeneData = product.terpenes.map((terpene) => ({
    name: terpene.name,
    value: parsePercentage(terpene.percentage),
    effect: getTerpeneEffect(terpene.name),
    detailedEffect: getTerpeneDetailedEffect(terpene.name)
  }));

  const totalPercentage = terpeneData.reduce((total, terpene) => total + terpene.value, 0).toFixed(1);

  const handleTerpeneClick = (terpeneName: string) => {
    setExpandedTerpene(expandedTerpene === terpeneName ? null : terpeneName);
  };

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

  // Effect labels to be arranged around the egg
  const effectLabels = [
    { text: "schmerzlindernd", angle: 60 },
    { text: "stimmungsaufhellend", angle: 30 },
    { text: "schlaffördernd", angle: 330 },
    { text: "fokussierend", angle: 300 },
    { text: "beruhigend", angle: 240 },
    { text: "entzündungshemmend", angle: 210 },
    { text: "antioxidativ", angle: 150 },
    { text: "entspannend", angle: 120 }
  ];

  // Define terpene positions within the egg
  const getTerpenePositionInEgg = (index: number, total: number) => {
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
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">Terpene</h4>
        <span className="text-sm font-medium">{totalPercentage}%</span>
      </div>
      
      <div className="flex flex-col md:flex-row gap-3 items-center md:items-start">
        {/* The egg visualization - with more pronounced egg shape */}
        <div className="relative h-[280px] w-[240px] flex-shrink-0 mx-auto mb-4 md:mx-0">
          {/* Gradient background for the egg - improved dark mode appearance */}
          <div className="absolute w-[200px] h-[240px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        border border-border/50"
               style={{ 
                 borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", /* egg shape */
                 background: isDark 
                   ? "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.2) 0%, rgba(14, 165, 233, 0.07) 70%, transparent 100%)"
                   : "radial-gradient(ellipse at center, rgba(16, 185, 129, 0.1) 0%, rgba(14, 165, 233, 0.05) 70%, transparent 100%)",
                 boxShadow: isDark 
                   ? "0 0 60px rgba(16, 185, 129, 0.15), inset 0 0 30px rgba(14, 165, 233, 0.1)"
                   : "0 0 40px rgba(34, 197, 94, 0.1), inset 0 0 20px rgba(14, 165, 233, 0.05)"
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
          
          {/* Effect labels arranged around the egg */}
          {effectLabels.map((label, idx) => {
            const angle = label.angle;
            const radian = (angle * Math.PI) / 180;
            
            // Calculate position for each label - outside the egg
            const left = 50 + 55 * Math.cos(radian);
            const top = 50 + 60 * Math.sin(radian);
            
            return (
              <div
                key={idx}
                className={cn(
                  "absolute text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap z-10",
                  isDark 
                    ? "bg-green-800/80 text-green-50 backdrop-blur-sm"
                    : "bg-green-700 text-white"
                )}
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: "translate(-50%, -50%)",
                  textShadow: "0px 0px 4px rgba(0,0,0,0.5)",
                  boxShadow: isDark 
                    ? "0 2px 10px rgba(16, 185, 129, 0.3), inset 0 0 0 1px rgba(255, 255, 255, 0.1)"
                    : "0 2px 8px rgba(0,0,0,0.2)"
                }}
              >
                {label.text}
              </div>
            );
          })}
          
          {/* Terpene shapes positioned within the egg */}
          {terpeneData.map((terpene, index) => {
            const position = getTerpenePositionInEgg(index, terpeneData.length);
            const dotSize = getDotSize(terpene.value);
            const color = colors[index % colors.length];
            
            return (
              <div 
                key={terpene.name} 
                className={cn(
                  "absolute flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 z-20",
                  expandedTerpene === terpene.name ? "ring-2 ring-primary ring-offset-1" : ""
                )}
                style={{
                  color: color,
                  ...position,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleTerpeneClick(terpene.name)}
              >
                {/* Improved glow for dark mode */}
                <div 
                  className="absolute inset-0 rounded-full blur-[8px] opacity-80"
                  style={{ 
                    backgroundColor: isDark ? color : `${color}70`,
                    width: `${dotSize + 8}px`,
                    height: `${dotSize + 8}px`
                  }}
                ></div>
                
                {/* Terpene shape with drop shadow */}
                <div 
                  className="relative drop-shadow-lg" 
                  style={{ 
                    filter: isDark 
                      ? `drop-shadow(0 0 10px ${color}) drop-shadow(0 0 5px ${color}80)` 
                      : `drop-shadow(0 0 8px ${color}80)`
                  }}
                >
                  {getTerpeneShapeIcon(terpene.name, dotSize)}
                </div>
                
                {/* Percentage label with improved contrast */}
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                  {terpene.value}%
                </span>
                
                {/* Terpene name label always visible */}
                <div 
                  className={cn(
                    "absolute whitespace-nowrap px-2 py-0.5 rounded-full text-[11px] font-medium shadow-lg backdrop-blur-sm",
                    isDark 
                      ? "bg-gray-900/80 border border-gray-700/50" 
                      : "bg-background/90 border border-primary/20"
                  )}
                  style={{
                    top: '120%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: color,
                  }}
                >
                  {terpene.name}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Terpene legends and descriptions - Minimalist style with improved dark mode support */}
        <div className="flex flex-col flex-1 w-full md:w-auto justify-start">
          {terpeneData.map((terpene, index) => (
            <Collapsible 
              key={index}
              className="mb-1.5 last:mb-0"
              open={expandedTerpene === terpene.name}
              onOpenChange={() => handleTerpeneClick(terpene.name)}
            >
              <CollapsibleTrigger 
                className={cn(
                  "flex items-center w-full text-sm py-1.5 hover:bg-background/60 rounded px-2 transition-colors",
                  isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-100/80"
                )}
              >
                <div
                  className="w-5 h-5 mr-2 flex-shrink-0 flex items-center justify-center"
                  style={{ color: colors[index % colors.length] }}
                >
                  {getTerpeneShapeIcon(terpene.name, 18)}
                </div>
                <span className="mr-1 font-medium flex-grow text-left">{terpene.name}</span>
                <span className="text-foreground/70 mr-2">{terpene.value}%</span>
                {expandedTerpene === terpene.name ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              
              <CollapsibleContent 
                className={cn(
                  "pl-6 pr-2 pt-1 pb-2.5 text-sm text-foreground/80 ml-1.5 border-l-[3px] rounded-r", 
                  isDark ? "bg-gray-900/30" : "bg-gray-50/80"
                )}
                style={{ 
                  borderColor: colors[index % colors.length], 
                }}
              >
                {terpene.effect}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TerpeneEgg;
