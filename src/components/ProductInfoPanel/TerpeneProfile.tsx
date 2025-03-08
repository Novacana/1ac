
import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { getTerpeneColor, parsePercentage, getTerpeneEffect, getTerpeneDetailedEffect } from "./utils";
import { Product } from "@/types/product";
import { useIsMobile } from "@/hooks/use-mobile";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface TerpeneProfileProps {
  product: Product;
}

const TerpeneProfile: React.FC<TerpeneProfileProps> = ({ product }) => {
  const isMobile = useIsMobile();
  const [expandedTerpene, setExpandedTerpene] = useState<string | null>(null);
  
  if (!product.terpenes || product.terpenes.length === 0) return null;

  // Create terpene data for the pie chart with more vibrant colors
  const terpeneData = product.terpenes.map((terpene) => ({
    name: terpene.name,
    value: parsePercentage(terpene.percentage),
    effect: getTerpeneEffect(terpene.name),
    detailedEffect: getTerpeneDetailedEffect(terpene.name)
  }));

  const totalPercentage = terpeneData.reduce((total, terpene) => total + terpene.value, 0).toFixed(1);

  const handleTerpeneClick = (terpeneName: string) => {
    setExpandedTerpene(expandedTerpene === terpeneName ? null : terpeneName);
  };

  // Vibrant color palette for better visibility
  const colors = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#EF4444'];

  // Custom label renderer for desktop view
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    if (isMobile) return null; // Don't show labels on mobile
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#fff" 
        textAnchor="middle" 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-medium">Terpene</h4>
        <span className="text-sm font-medium">{totalPercentage}%</span>
      </div>
      
      {isMobile ? (
        // Mobile layout (vertical)
        <div className="flex gap-3 items-start">
          <div className="relative h-[80px] w-[80px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <Pie
                  data={terpeneData}
                  cx="50%"
                  cy="50%"
                  innerRadius={15}
                  outerRadius={35}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={1000}
                  animationBegin={200}
                  stroke="none"
                >
                  {terpeneData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]} 
                      style={{ filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.1))' }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex flex-col justify-center flex-1 overflow-hidden">
            {terpeneData.map((terpene, index) => (
              <Collapsible 
                key={index}
                className="mb-1.5 last:mb-0"
                open={expandedTerpene === terpene.name}
                onOpenChange={() => handleTerpeneClick(terpene.name)}
              >
                <CollapsibleTrigger className="flex items-center w-full text-sm py-0.5 hover:bg-background/60 rounded px-1 transition-colors">
                  <span 
                    className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="mr-1 font-medium flex-grow text-left">{terpene.name}</span>
                  <span className="text-foreground/70 mr-2">{terpene.value}%</span>
                  {expandedTerpene === terpene.name ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                
                <CollapsibleContent className="pl-5 pr-1 pt-1 pb-1 text-sm text-foreground/80 border-l-2 ml-1.5" 
                  style={{ borderColor: colors[index % colors.length] }}>
                  {terpene.effect}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      ) : (
        // Desktop layout (horizontal)
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="relative h-[130px] w-[130px] flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <Pie
                  data={terpeneData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={55}
                  paddingAngle={3}
                  dataKey="value"
                  animationDuration={1000}
                  animationBegin={200}
                  stroke="none"
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {terpeneData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]} 
                      style={{ filter: 'drop-shadow(0px 3px 5px rgba(0,0,0,0.15))' }}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 flex-1">
            {terpeneData.map((terpene, index) => (
              <Collapsible 
                key={index}
                className="mb-1 last:mb-0 bg-background/50 rounded-md border border-border/20 shadow-sm"
                open={expandedTerpene === terpene.name}
                onOpenChange={() => handleTerpeneClick(terpene.name)}
              >
                <CollapsibleTrigger className="flex items-center w-full text-sm py-2 px-3 hover:bg-background/80 rounded-t-md transition-colors">
                  <span 
                    className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <span className="mr-2 font-medium flex-grow text-left">{terpene.name}</span>
                  <span className="text-foreground/70 mr-2 font-medium">{terpene.value}%</span>
                  {expandedTerpene === terpene.name ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </CollapsibleTrigger>
                
                <CollapsibleContent className="px-4 pt-2 pb-3 text-sm text-foreground/80 border-t border-border/10">
                  {terpene.detailedEffect}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TerpeneProfile;
