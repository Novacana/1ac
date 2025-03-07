
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getTerpeneColor, parsePercentage, getTerpeneEffect } from "./utils";
import { Product } from "@/types/product";

interface TerpeneProfileProps {
  product: Product;
}

const TerpeneProfile: React.FC<TerpeneProfileProps> = ({ product }) => {
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
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-xs font-medium">Terpene</h4>
        <span className="text-xs font-medium">{totalPercentage}%</span>
      </div>
      <div className="flex items-start">
        <div className="h-[120px] relative w-1/2">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={terpeneData}
                cx="50%"
                cy="50%"
                innerRadius={22}
                outerRadius={42}
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
        
        {/* Terpene effects */}
        <div className="ml-4 w-1/2">
          <div className="text-[10px] text-foreground/70 h-[120px] overflow-y-auto pr-2">
            {terpeneData.map((terpene, index) => (
              <div key={index} className="mb-2 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex items-center">
                  <div 
                    className="w-2 h-2 rounded-full mr-1.5 flex-shrink-0"
                    style={{ backgroundColor: terpene.color }}
                  />
                  <span className="font-medium">{terpene.name}</span>
                </div>
                <div className="pl-3.5 leading-tight">{terpene.effect}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Compact legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-2">
        {terpeneData.map((terpene, index) => (
          <div key={index} className="flex items-center text-[10px] animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div 
              className="w-2 h-2 rounded-full mr-1 flex-shrink-0"
              style={{ 
                backgroundColor: terpene.color,
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            />
            <span className="font-medium whitespace-nowrap">{terpene.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerpeneProfile;
