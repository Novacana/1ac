
import React from 'react';
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getTerpeneShapeIcon } from './terpeneUtils';

interface TerpeneData {
  name: string;
  value: number;
  effect: string;
  detailedEffect: string;
}

interface TerpeneLegendProps {
  terpeneData: TerpeneData[];
  expandedTerpene: string | null;
  onTerpeneClick: (terpeneName: string) => void;
  isDark: boolean;
}

const TerpeneLegend: React.FC<TerpeneLegendProps> = ({
  terpeneData,
  expandedTerpene,
  onTerpeneClick,
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
    <div className="flex flex-col flex-1 w-full md:w-auto justify-start">
      {terpeneData.map((terpene, index) => (
        <Collapsible 
          key={index}
          className="mb-1.5 last:mb-0"
          open={expandedTerpene === terpene.name}
          onOpenChange={() => onTerpeneClick(terpene.name)}
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
  );
};

export default TerpeneLegend;
