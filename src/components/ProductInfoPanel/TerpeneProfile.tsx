
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getTerpeneColor, parsePercentage } from "./utils";
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
    color: getTerpeneColor(terpene.name)
  }));

  const totalPercentage = terpeneData.reduce((total, terpene) => total + terpene.value, 0).toFixed(1);

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-xs font-medium">Terpene</h4>
        <span className="text-xs font-medium">{totalPercentage}%</span>
      </div>
      <div className="h-[100px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={terpeneData}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={38}
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
                  style={{ filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.1))' }}
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
      
      {/* Compact legend */}
      <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1">
        {terpeneData.map((terpene, index) => (
          <div key={index} className="flex items-center text-[9px] animate-scale-in" style={{ animationDelay: `${index * 50}ms` }}>
            <div 
              className="w-1.5 h-1.5 rounded-full mr-0.5 flex-shrink-0"
              style={{ 
                backgroundColor: terpene.color,
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
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
