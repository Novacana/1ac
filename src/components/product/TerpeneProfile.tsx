
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTerpeneColor } from "@/utils/productUtils";

interface Terpene {
  name: string;
  percentage: string;
}

interface TerpeneProfileProps {
  terpenes?: Terpene[];
}

const TerpeneProfile: React.FC<TerpeneProfileProps> = ({ terpenes }) => {
  const { t } = useLanguage();

  if (!terpenes || terpenes.length === 0) return null;

  // Parse percentage values from terpenes
  const parsePercentage = (value: string | undefined) => {
    if (!value) return 0;
    const match = value.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
  };

  // Create terpene data for the pie chart
  const terpeneData = terpenes.map((terpene) => ({
    name: terpene.name,
    value: parsePercentage(terpene.percentage),
    color: getTerpeneColor(terpene.name)
  }));

  return (
    <div>
      <h4 className="text-xs font-medium mb-1">{t("terpene_profile")}</h4>
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
              formatter={(value) => [`${value}%`, t("concentration")]}
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
