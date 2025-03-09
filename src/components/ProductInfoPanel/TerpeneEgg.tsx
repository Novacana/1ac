
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Circle, Diamond, Hexagon, Pentagon, Square, Triangle, Octagon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const colors = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#EF4444'];

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
        <div className="relative h-[180px] w-[180px] flex-shrink-0 mx-auto mb-4 md:mx-0 border border-border/30 rounded-[50%] bg-gradient-to-b from-yellow-50 to-blue-50 dark:from-yellow-950/30 dark:to-blue-950/30">
          {/* Egg border with aromatic properties */}
          <div className="absolute inset-0 rounded-[50%] border border-dashed border-border/40 flex items-center justify-center">
            <div className="text-[9px] text-muted-foreground font-light rotate-[30deg] absolute top-2 left-1/4">entspannend</div>
            <div className="text-[9px] text-muted-foreground font-light rotate-[60deg] absolute top-1/4 right-4">beruhigend</div>
            <div className="text-[9px] text-muted-foreground font-light rotate-[120deg] absolute bottom-1/4 right-4">entzündungshemmend</div>
            <div className="text-[9px] text-muted-foreground font-light rotate-[145deg] absolute bottom-2 right-1/4">schmerzlindernd</div>
            <div className="text-[9px] text-muted-foreground font-light rotate-[-30deg] absolute top-2 right-1/4">stimmungsaufhellend</div>
            <div className="text-[9px] text-muted-foreground font-light rotate-[-60deg] absolute top-1/4 left-4">fokussierend</div>
            <div className="text-[9px] text-muted-foreground font-light rotate-[-120deg] absolute bottom-1/4 left-4">antioxidativ</div>
            <div className="text-[9px] text-muted-foreground font-light rotate-[-145deg] absolute bottom-2 left-1/4">schlaffördernd</div>
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
                {getTerpeneShapeIcon(terpene.name, dotSize)}
                
                {/* Percentage label */}
                <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                  {terpene.value}%
                </span>
                
                {/* Terpene name label for desktop */}
                <span 
                  className="hidden md:block absolute whitespace-nowrap px-1 py-0.5 text-[10px] rounded-md bg-background/80 text-foreground"
                  style={{
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    marginTop: '2px'
                  }}
                >
                  {terpene.name}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Terpene legends and descriptions - Mobile and Desktop */}
        <div className="flex flex-col flex-1 w-full md:w-auto justify-start">
          {terpeneData.map((terpene, index) => (
            <Collapsible 
              key={index}
              className="mb-1 last:mb-0"
              open={expandedTerpene === terpene.name}
              onOpenChange={() => handleTerpeneClick(terpene.name)}
            >
              <CollapsibleTrigger className="flex items-center w-full text-sm py-1 hover:bg-background/60 rounded px-1 transition-colors">
                <div
                  className="w-4 h-4 mr-2 flex-shrink-0 flex items-center justify-center"
                  style={{ color: colors[index % colors.length] }}
                >
                  {getTerpeneShapeIcon(terpene.name, 16)}
                </div>
                <span className="mr-1 font-medium flex-grow text-left">{terpene.name}</span>
                <span className="text-foreground/70 mr-2">{terpene.value}%</span>
                {expandedTerpene === terpene.name ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </CollapsibleTrigger>
              
              <CollapsibleContent className="pl-5 pr-1 pt-1 pb-2 text-sm text-foreground/80 border-l-2 ml-1.5" 
                style={{ borderColor: colors[index % colors.length] }}>
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
