
import React from 'react';
import { cn } from "@/lib/utils";
import { getTerpeneShapeIcon } from './terpeneUtils';

interface TerpeneData {
  name: string;
  value: number;
  effect: string;
  detailedEffect?: string;  // Made optional to match visualization component
}

interface TerpeneLegendProps {
  terpeneData: TerpeneData[];
  expandedTerpene: string | null;
  onTerpeneClick: (terpeneName: string) => void;
  isDark: boolean;
}

const TerpeneLegend: React.FC<TerpeneLegendProps> = ({
  terpeneData,
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
        <div 
          key={index}
          className={cn(
            "mb-2.5 last:mb-0 py-1.5 px-2 rounded",
            isDark ? "bg-gray-900/30" : "bg-gray-50/80"
          )}
        >
          <div className="flex items-center mb-1">
            <div
              className="w-5 h-5 mr-2 flex-shrink-0 flex items-center justify-center"
              style={{ color: colors[index % colors.length] }}
            >
              {getTerpeneShapeIcon(terpene.name, 18)}
            </div>
            <span className="mr-1 font-medium flex-grow text-left">{terpene.name}</span>
            <span className="text-foreground/70">{terpene.value}%</span>
          </div>
          
          <div 
            className={cn(
              "text-sm text-foreground/80 pl-7", 
            )}
          >
            {terpene.effect}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TerpeneLegend;
