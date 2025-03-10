
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
  isDark: boolean;
}

const TerpeneLegend: React.FC<TerpeneLegendProps> = ({
  terpeneData,
  expandedTerpene,
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

  // If no terpene is expanded, just show a message
  if (!expandedTerpene) {
    return (
      <div className="flex flex-col flex-1 w-full md:w-auto justify-start items-center p-3">
        <p className="text-sm text-foreground/70 italic">
          Wählen Sie ein Terpen, um Details anzuzeigen
        </p>
      </div>
    );
  }

  // Find the expanded terpene
  const selectedTerpene = terpeneData.find(t => t.name === expandedTerpene);
  if (!selectedTerpene) return null;

  // Find the index to get the right color
  const terpeneIndex = terpeneData.findIndex(t => t.name === expandedTerpene);
  const color = colors[terpeneIndex % colors.length];

  return (
    <div className="flex flex-col flex-1 w-full md:w-auto justify-start">
      <div 
        className={cn(
          "p-3 rounded",
          isDark ? "bg-gray-900/30" : "bg-gray-50/80"
        )}
      >
        <div className="flex items-center mb-2">
          <div
            className="w-6 h-6 mr-2 flex-shrink-0 flex items-center justify-center"
            style={{ color }}
          >
            {getTerpeneShapeIcon(selectedTerpene.name, 24)}
          </div>
          <span className="mr-1 font-medium flex-grow text-left text-lg">{selectedTerpene.name}</span>
          <span className="text-foreground/70 font-medium">{selectedTerpene.value}%</span>
        </div>
        
        <div className="text-foreground/80 mb-2">
          {selectedTerpene.effect}
        </div>

        {selectedTerpene.detailedEffect && (
          <div className="text-sm text-foreground/70 mt-2">
            {selectedTerpene.detailedEffect}
          </div>
        )}
      </div>
    </div>
  );
};

export default TerpeneLegend;
