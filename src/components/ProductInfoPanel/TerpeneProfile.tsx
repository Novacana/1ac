
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

  return (
    <div>
      <h4 className="text-xs font-medium mb-1">Terpen-Profil</h4>
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
              formatter={(value) => [`${value}%`, 'Konzentration']}
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
      
      {/* Legend */}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1">
        {terpeneData.map((terpene, index) => (
          <div key={index} className="flex items-center text-[10px]">
            <div 
              className="w-1.5 h-1.5 rounded-full mr-1 flex-shrink-0"
              style={{ backgroundColor: terpene.color }}
            />
            <span>{terpene.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TerpeneProfile;
