
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

  const totalPercentage = terpeneData.reduce((total, terpene) => total + terpene.value, 0).toFixed(1);

  const handleTerpeneClick = (terpeneName: string) => {
    setExpandedTerpene(expandedTerpene === terpeneName ? null : terpeneName);
  };

  return (
    <div className="w-full">
      <TerpeneTotal totalPercentage={totalPercentage} />
      
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-col'} gap-2`}>
        {/* The egg visualization - centered and properly sized */}
        <TerpeneVisualization 
          terpeneData={terpeneData} 
          expandedTerpene={expandedTerpene} 
          onTerpeneClick={handleTerpeneClick}
          isDark={isDark}
        />
        
        {/* Terpene legends and descriptions - sized appropriately */}
        <TerpeneLegend 
          terpeneData={terpeneData} 
          expandedTerpene={expandedTerpene} 
          onTerpeneClick={handleTerpeneClick}
          isDark={isDark}
        />
      </div>
    </div>
  );
};

export default TerpeneEgg;
