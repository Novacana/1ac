
import React, { useState } from "react";
import { Product } from "@/types/product";
import { useTheme } from "@/components/ThemeProvider";
import { parsePercentage } from "../utils";
import TerpeneTotal from "./TerpeneTotal";
import TerpeneVisualization from "./TerpeneVisualization";
import TerpeneLegend from "./TerpeneLegend";
import { getTerpeneEffect, getTerpeneDetailedEffect } from "./terpeneUtils";
import { useIsMobile } from "@/hooks/use-mobile";

interface TerpeneEggProps {
  product: Product;
}

const TerpeneEgg: React.FC<TerpeneEggProps> = ({ product }) => {
  const [expandedTerpene, setExpandedTerpene] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const isMobile = useIsMobile();
  
  if (!product.terpenes || product.terpenes.length === 0) return null;

  // Create terpene data
  const terpeneData = product.terpenes.map((terpene) => ({
    name: terpene.name,
    value: parsePercentage(terpene.percentage),
    effect: getTerpeneEffect(terpene.name),
    detailedEffect: getTerpeneDetailedEffect(terpene.name)
  }));

  // Calculate total percentage for relative values
  const totalPercentage = terpeneData.reduce((total, terpene) => total + terpene.value, 0);
  
  // Add relative percentage
  const terpeneDataWithRelative = terpeneData.map(terpene => ({
    ...terpene,
    relativeValue: Math.round((terpene.value / totalPercentage) * 100)
  }));

  const handleTerpeneClick = (terpeneName: string) => {
    setExpandedTerpene(expandedTerpene === terpeneName ? null : terpeneName);
  };

  return (
    <div className="w-full">
      <TerpeneTotal totalPercentage={totalPercentage.toFixed(1)} />
      
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3`}>
        {/* The egg visualization - properly sized */}
        <div className="flex-1">
          <TerpeneVisualization 
            terpeneData={terpeneDataWithRelative} 
            expandedTerpene={expandedTerpene} 
            onTerpeneClick={handleTerpeneClick}
            isDark={isDark}
          />
        </div>
        
        {/* Terpene legends and descriptions */}
        <div className="flex-1">
          <TerpeneLegend 
            terpeneData={terpeneDataWithRelative} 
            expandedTerpene={expandedTerpene} 
            onTerpeneClick={handleTerpeneClick}
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
};

export default TerpeneEgg;
