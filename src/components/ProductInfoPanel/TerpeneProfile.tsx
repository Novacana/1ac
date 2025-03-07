
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getTerpeneColor, parsePercentage, getTerpeneEffect } from "./utils";
import { Product } from "@/types/product";
import { useIsMobile } from "@/hooks/use-mobile";

interface TerpeneProfileProps {
  product: Product;
}

const TerpeneProfile: React.FC<TerpeneProfileProps> = ({ product }) => {
  const isMobile = useIsMobile();
  
  if (!product.terpenes || product.terpenes.length === 0) return null;

  // Create terpene data for the pie chart
  const terpeneData = product.terpenes.map((terpene) => ({
    name: terpene.name,
    value: parsePercentage(terpene.percentage),
    color: getTerpeneColor(terpene.name),
    effect: getTerpeneEffect(terpene.name)
  }));

  const totalPercentage = terpeneData.reduce((total, terpene) => total + terpene.value, 0).toFixed(1);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-xs font-medium">Terpene</h4>
        <span className="text-xs font-medium">{totalPercentage}%</span>
      </div>
      
      {/* Compact terpene list + pie chart */}
      <div className="flex flex-wrap gap-1.5 mb-2">
        {terpeneData.map((terpene, index) => (
          <div 
            key={index} 
            className="flex items-center text-xs bg-background/50 rounded px-1.5 py-0.5 border border-border/30"
            title={terpene.effect}
          >
            <span 
              className="w-2 h-2 rounded-full mr-1.5 flex-shrink-0"
              style={{ backgroundColor: terpene.color }}
            />
            <span>{terpene.name}</span>
            <span className="ml-1 text-foreground/70">{terpene.value}%</span>
          </div>
        ))}
      </div>
      
      <div className="flex items-start">
        <div className={`h-[80px] relative ${isMobile ? 'w-full' : 'w-full'}`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={terpeneData}
                cx="50%"
                cy="50%"
                innerRadius={15}
                outerRadius={30}
                paddingAngle={2}
                dataKey="value"
                animationDuration={1500}
                animationBegin={300}
                stroke="none"
                strokeWidth={1}
              >
                {terpeneData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    style={{ filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.05))' }}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Konzentration']}
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', 
                  borderRadius: '8px',
                  fontSize: '10px',
                  padding: '6px 10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  border: 'none'
                }}
                wrapperStyle={{ outline: 'none' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Terpene effects - only show on desktop */}
      {!isMobile && (
        <div className="text-[9px] text-foreground/70 max-h-[60px] overflow-y-auto mt-1 border-t border-border/20 pt-1">
          {terpeneData.slice(0, 2).map((terpene, index) => (
            <div key={index} className="flex items-start mb-0.5">
              <div 
                className="w-1.5 h-1.5 rounded-full mr-1 flex-shrink-0 mt-0.5"
                style={{ backgroundColor: terpene.color }}
              />
              <div>
                <span className="font-medium">{terpene.name}:</span>
                <span className="ml-0.5">{terpene.effect}</span>
              </div>
            </div>
          ))}
          {terpeneData.length > 2 && (
            <div className="text-[8px] text-foreground/50 mt-0.5">
              + {terpeneData.length - 2} weitere Terpene
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TerpeneProfile;
