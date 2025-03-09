
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/types/product";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useIsMobile } from "@/hooks/use-mobile";
import { parsePercentage, getTerpeneEffect, getTerpeneDetailedEffect } from "./utils";

interface TerpeneEggProps {
  product: Product;
}

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
    if (percentage >= 1.0) return 'h-6 w-6';
    if (percentage >= 0.5) return 'h-5 w-5';
    if (percentage >= 0.3) return 'h-4 w-4';
    return 'h-3 w-3';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">Terpene</h4>
        <span className="text-sm font-medium">{totalPercentage}%</span>
      </div>
      
      <div className="flex gap-3 items-start">
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
          
          {/* Terpene dots positioned in the egg */}
          {terpeneData.map((terpene, index) => {
            const position = getTerpenePosition(index, terpeneData.length);
            const dotSize = getDotSize(terpene.value);
            
            return (
              <div 
                key={terpene.name} 
                className={cn(
                  "absolute rounded-full shadow-sm flex items-center justify-center transition-all cursor-pointer hover:scale-110",
                  dotSize,
                  expandedTerpene === terpene.name ? "ring-2 ring-primary ring-offset-1" : ""
                )}
                style={{
                  backgroundColor: colors[index % colors.length],
                  ...position,
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => handleTerpeneClick(terpene.name)}
                title={`${terpene.name} ${terpene.value}%`}
              >
                <span className="text-[8px] font-bold text-white">{terpene.value}%</span>
              </div>
            );
          })}
        </div>
        
        {/* Terpene legends and descriptions */}
        <div className="flex flex-col flex-1 justify-start">
          {terpeneData.map((terpene, index) => (
            <Collapsible 
              key={index}
              className="mb-1 last:mb-0"
              open={expandedTerpene === terpene.name}
              onOpenChange={() => handleTerpeneClick(terpene.name)}
            >
              <CollapsibleTrigger className="flex items-center w-full text-sm py-1 hover:bg-background/60 rounded px-1 transition-colors">
                <span 
                  className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                  style={{ backgroundColor: colors[index % colors.length] }}
                />
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
