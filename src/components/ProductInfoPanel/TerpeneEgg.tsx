
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

  // Helper to get the terpene position in the egg visualization
  const getTerpenePosition = (index: number, total: number) => {
    const positions = [
      { top: '10%', left: '50%' },      // Top center
      { top: '25%', left: '20%' },      // Top left 
      { top: '25%', right: '20%' },     // Top right
      { bottom: '25%', left: '20%' },   // Bottom left
      { bottom: '25%', right: '20%' },  // Bottom right
      { bottom: '10%', left: '50%' },   // Bottom center
    ];
    
    // Use modulo to handle more than 6 terpenes
    return positions[index % positions.length];
  };

  // Determine the size of the dot based on the percentage
  const getDotSize = (percentage: number) => {
    if (percentage >= 1.0) return 24;
    if (percentage >= 0.5) return 20;
    if (percentage >= 0.3) return 16;
    return 14;
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">Terpene</h4>
        <span className="text-sm font-medium">{totalPercentage}%</span>
      </div>
      
      <div className="flex flex-col md:flex-row gap-3 items-center md:items-start">
        {/* The egg visualization */}
        <div className="relative h-[180px] w-[180px] flex-shrink-0 mx-auto mb-4 md:mx-0 
                      border border-border/50 rounded-[50%] 
                      bg-gradient-to-b from-primary/5 to-secondary/10 
                      dark:from-primary/10 dark:to-secondary/20">
          {/* Egg property text with improved visibility */}
          <div className="absolute inset-0 rounded-[50%] border border-dashed border-primary/30 flex items-center justify-center">
            {/* Property texts with better contrast */}
            <div className="text-[9px] font-medium text-white px-1.5 py-0.5 rounded-full bg-primary/40 backdrop-blur-sm 
                          rotate-[30deg] absolute top-3 left-1/4 shadow-md">
              entspannend
            </div>
            <div className="text-[9px] font-medium text-white px-1.5 py-0.5 rounded-full bg-primary/40 backdrop-blur-sm 
                          rotate-[60deg] absolute top-1/4 right-4 shadow-md">
              beruhigend
            </div>
            <div className="text-[9px] font-medium text-white px-1.5 py-0.5 rounded-full bg-primary/40 backdrop-blur-sm 
                          rotate-[120deg] absolute bottom-1/4 right-6 shadow-md">
              entzündungshemmend
            </div>
            <div className="text-[9px] font-medium text-white px-1.5 py-0.5 rounded-full bg-primary/40 backdrop-blur-sm 
                          rotate-[145deg] absolute bottom-3 right-1/4 shadow-md">
              schmerzlindernd
            </div>
            <div className="text-[9px] font-medium text-white px-1.5 py-0.5 rounded-full bg-primary/40 backdrop-blur-sm 
                          rotate-[-30deg] absolute top-3 right-1/4 shadow-md">
              stimmungsaufhellend
            </div>
            <div className="text-[9px] font-medium text-white px-1.5 py-0.5 rounded-full bg-primary/40 backdrop-blur-sm 
                          rotate-[-60deg] absolute top-1/4 left-4 shadow-md">
              fokussierend
            </div>
            <div className="text-[9px] font-medium text-white px-1.5 py-0.5 rounded-full bg-primary/40 backdrop-blur-sm 
                          rotate-[-120deg] absolute bottom-1/4 left-6 shadow-md">
              antioxidativ
            </div>
            <div className="text-[9px] font-medium text-white px-1.5 py-0.5 rounded-full bg-primary/40 backdrop-blur-sm 
                          rotate-[-145deg] absolute bottom-3 left-1/4 shadow-md">
              schlaffördernd
            </div>
          </div>
          
          {/* Terpene shapes positioned in the egg */}
          {terpeneData.map((terpene, index) => {
            const position = getTerpenePosition(index, terpeneData.length);
            const dotSize = getDotSize(terpene.value);
            const color = colors[index % colors.length];
            
            return (
              <div 
                key={terpene.name} 
                className={cn(
                  "absolute flex items-center justify-center transition-all cursor-pointer hover:scale-110",
                  expandedTerpene === terpene.name ? "ring-2 ring-primary ring-offset-1" : ""
                )}
                style={{
                  color: color,
                  ...position,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleTerpeneClick(terpene.name)}
                title={`${terpene.name} ${terpene.value}%`}
              >
                {/* Glowing background for the shape */}
                <div 
                  className="absolute inset-0 rounded-full blur-[8px] opacity-40"
                  style={{ 
                    backgroundColor: color,
                    width: `${dotSize + 4}px`,
                    height: `${dotSize + 4}px`
                  }}
                ></div>
                
                {/* Terpene shape with drop shadow */}
                <div className="relative drop-shadow-lg" style={{ filter: `drop-shadow(0 0 6px ${color})` }}>
                  {getTerpeneShapeIcon(terpene.name, dotSize)}
                </div>
                
                {/* Percentage label with improved contrast */}
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md">
                  {terpene.value}%
                </span>
                
                {/* Terpene name label with improved visibility */}
                <div 
                  className="hidden md:flex absolute whitespace-nowrap px-2 py-1 
                            rounded-full bg-background/90 dark:bg-background/80 
                            text-[10px] font-medium border border-primary/20 shadow-lg
                            backdrop-blur-sm items-center justify-center"
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
        
        {/* Terpene legends and descriptions - Mobile and Desktop */}
        <div className="flex flex-col flex-1 w-full md:w-auto justify-start">
          {terpeneData.map((terpene, index) => (
            <Collapsible 
              key={index}
              className="mb-1.5 last:mb-0"
              open={expandedTerpene === terpene.name}
              onOpenChange={() => handleTerpeneClick(terpene.name)}
            >
              <CollapsibleTrigger className="flex items-center w-full text-sm py-1.5 hover:bg-background/60 rounded px-2 transition-colors">
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
                className="pl-6 pr-2 pt-1 pb-2.5 text-sm text-foreground/80 ml-1.5 border-l-[3px] rounded-r" 
                style={{ borderColor: colors[index % colors.length], backgroundColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }}
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
