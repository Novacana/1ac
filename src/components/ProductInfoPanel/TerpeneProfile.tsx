
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface Terpene {
  name: string;
  percentage: string;
}

interface TerpeneProfileProps {
  terpenes?: Terpene[];
}

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

export const TerpeneProfile: React.FC<TerpeneProfileProps> = ({ terpenes }) => {
  if (!terpenes || terpenes.length === 0) return null;

  const parsePercentage = (value: string | undefined) => {
    if (!value) return 0;
    const match = value.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
  };

  const terpeneData = terpenes.map(terpene => ({
    name: terpene.name,
    value: parsePercentage(terpene.percentage),
    color: getTerpeneColor(terpene.name)
  }));

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
