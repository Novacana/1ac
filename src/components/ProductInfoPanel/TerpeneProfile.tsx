
import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getTerpeneColor, parsePercentage, getTerpeneEffect } from "./utils";
import { Product } from "@/types/product";
import { useIsMobile } from "@/hooks/use-mobile";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface TerpeneProfileProps {
  product: Product;
}

const TerpeneProfile: React.FC<TerpeneProfileProps> = ({ product }) => {
  const isMobile = useIsMobile();
  const [expandedTerpene, setExpandedTerpene] = useState<string | null>(null);
  
  if (!product.terpenes || product.terpenes.length === 0) return null;

  // Create terpene data for the pie chart
  const terpeneData = product.terpenes.map((terpene) => ({
    name: terpene.name,
    value: parsePercentage(terpene.percentage),
    color: getTerpeneColor(terpene.name),
    effect: getTerpeneEffect(terpene.name)
  }));

  const totalPercentage = terpeneData.reduce((total, terpene) => total + terpene.value, 0).toFixed(1);

  const handleTerpeneClick = (terpeneName: string) => {
    setExpandedTerpene(expandedTerpene === terpeneName ? null : terpeneName);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <h4 className="text-xs font-medium">Terpene</h4>
        <span className="text-xs font-medium">{totalPercentage}%</span>
      </div>
      
      <div className="flex gap-2">
        {/* Compact pie chart */}
        <div className="h-[70px] w-[70px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={terpeneData}
                cx="50%"
                cy="50%"
                innerRadius={12}
                outerRadius={30}
                paddingAngle={2}
                dataKey="value"
                animationDuration={1500}
                animationBegin={300}
                stroke="none"
              >
                {terpeneData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    style={{ filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.05))' }}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Compact terpene list with interactive elements */}
        <div className="flex flex-col justify-center flex-1">
          {terpeneData.slice(0, 3).map((terpene, index) => (
            <div 
              key={index} 
              className="flex items-center text-xs mb-0.5 cursor-pointer group"
              onClick={() => handleTerpeneClick(terpene.name)}
            >
              <span 
                className="w-2 h-2 rounded-full mr-1.5 flex-shrink-0"
                style={{ backgroundColor: terpene.color }}
              />
              <span className="mr-1 group-hover:underline">{terpene.name}</span>
              <span className="text-foreground/70 mr-1">{terpene.value}%</span>
              <Info className="h-3 w-3 text-muted-foreground opacity-60 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Expanded terpene effects information */}
      {terpeneData.map((terpene) => (
        <div 
          key={terpene.name}
          className={cn(
            "text-xs text-foreground/80 mt-1 border-t border-border/20 pt-1 pb-1 overflow-hidden transition-all duration-300",
            expandedTerpene === terpene.name ? "max-h-24 opacity-100" : "max-h-0 opacity-0 border-t-0 pt-0 pb-0"
          )}
        >
          <div className="flex items-start">
            <div 
              className="w-2 h-2 rounded-full mr-1.5 flex-shrink-0 mt-0.5"
              style={{ backgroundColor: terpene.color }}
            />
            <div>
              <span className="font-medium">{terpene.name}: </span>
              <span>{terpene.effect}</span>
            </div>
          </div>
        </div>
      ))}
      
      {/* Default terpene effects - only show on desktop when no terpene is selected */}
      {!isMobile && !expandedTerpene && terpeneData.length > 0 && (
        <div className="text-[9px] text-foreground/70 mt-1 border-t border-border/20 pt-1 max-h-[30px] overflow-hidden">
          <div className="flex items-start">
            <div 
              className="w-1.5 h-1.5 rounded-full mr-1 flex-shrink-0 mt-0.5"
              style={{ backgroundColor: terpeneData[0].color }}
            />
            <div>
              <span className="font-medium">{terpeneData[0].name}:</span>
              <span className="ml-0.5">{terpeneData[0].effect}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerpeneProfile;
