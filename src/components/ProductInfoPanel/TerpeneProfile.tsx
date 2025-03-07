
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Terpene {
  name: string;
  percentage: string;
}

interface TerpeneProfileProps {
  terpenes?: Terpene[];
}

// Helper function to get colors for different terpenes
const getTerpeneColor = (terpene: string): string => {
  const colors: Record<string, string> = {
    'Myrcene': '#3a9a40',
    'Limonene': '#ffbb00',
    'Caryophyllene': '#ff5733',
    'Pinene': '#00a86b',
    'Linalool': '#8a2be2',
    'Terpinolene': '#4682b4',
    'Ocimene': '#ff4500',
    'Humulene': '#a0522d',
    'Bisabolol': '#d8bfd8'
  };
  
  return colors[terpene] || '#' + Math.floor(Math.random()*16777215).toString(16);
};

// Get terpene effects information
const getTerpeneEffects = (terpene: string): { effect: string; color: string } => {
  const effects: Record<string, { effect: string; color: string }> = {
    'Myrcene': { effect: 'Relaxing, Sedative', color: '#F2FCE2' },
    'Limonene': { effect: 'Uplifting, Mood Enhancing', color: '#FEF7CD' },
    'Caryophyllene': { effect: 'Anti-inflammatory, Pain Relief', color: '#FEC6A1' },
    'Pinene': { effect: 'Mental Clarity, Alertness', color: '#D3E4FD' },
    'Linalool': { effect: 'Calming, Anxiety Reducing', color: '#E5DEFF' },
    'Terpinolene': { effect: 'Uplifting, Energetic', color: '#FFDEE2' },
    'Ocimene': { effect: 'Decongestant, Antiviral', color: '#FDE1D3' },
    'Humulene': { effect: 'Appetite Suppressant', color: '#F1F0FB' },
    'Bisabolol': { effect: 'Anti-irritant, Soothing', color: '#D946EF' }
  };
  
  return effects[terpene] || { effect: 'Various effects', color: '#F1F0FB' };
};

// Parse percentage from string
const parsePercentage = (value: string | undefined) => {
  if (!value) return 0;
  const match = value.match(/(\d+(\.\d+)?)/);
  return match ? parseFloat(match[0]) : 0;
};

export const TerpeneProfile: React.FC<TerpeneProfileProps> = ({ terpenes }) => {
  // Create terpene data for the pie chart
  const terpeneData = terpenes?.map((terpene) => ({
    name: terpene.name,
    value: parsePercentage(terpene.percentage),
    color: getTerpeneColor(terpene.name),
    effect: getTerpeneEffects(terpene.name).effect,
    effectColor: getTerpeneEffects(terpene.name).color
  })) || [];

  if (terpeneData.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-medium mb-1">Terpene Profile</h4>
      <div className="h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={terpeneData}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={35}
              paddingAngle={2}
              dataKey="value"
              animationDuration={1500}
              animationBegin={300}
            >
              {terpeneData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`${value}%`, 'Concentration']}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                borderRadius: '4px',
                fontSize: '10px',
                padding: '4px 8px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Legend with tooltips */}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
        <TooltipProvider>
          {terpeneData.map((terpene, index) => (
            <UITooltip key={index}>
              <TooltipTrigger asChild>
                <div className="flex items-center text-[10px] cursor-pointer">
                  <div 
                    className="w-1.5 h-1.5 rounded-full mr-1 flex-shrink-0"
                    style={{ backgroundColor: terpene.color }}
                  />
                  <span>{terpene.name}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent
                style={{ backgroundColor: terpene.effectColor }}
                className="text-xs p-2 max-w-[150px] text-foreground border border-border/20"
              >
                <p className="font-medium">{terpene.name}</p>
                <p className="text-[10px]">{terpene.effect}</p>
              </TooltipContent>
            </UITooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};
