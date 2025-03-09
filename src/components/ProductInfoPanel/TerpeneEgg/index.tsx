
import React, { useState } from "react";
import { Product } from "@/types/product";
import { useTheme } from "@/components/ThemeProvider";
import { parsePercentage } from "../utils";
import TerpeneTotal from "./TerpeneTotal";
import TerpeneVisualization from "./TerpeneVisualization";
import TerpeneLegend from "./TerpeneLegend";
import { getTerpeneEffect, getTerpeneDetailedEffect } from "./terpeneUtils";

interface TerpeneEggProps {
  product: Product;
}

const TerpeneEgg: React.FC<TerpeneEggProps> = ({ product }) => {
  const [expandedTerpene, setExpandedTerpene] = useState<string | null>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
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
    <div className="w-full relative">
      <TerpeneTotal totalPercentage={totalPercentage} />
      
      <div className="flex flex-col md:flex-row gap-3 items-center md:items-start mt-2">
        {/* The egg visualization */}
        <TerpeneVisualization 
          terpeneData={terpeneData} 
          expandedTerpene={expandedTerpene} 
          onTerpeneClick={handleTerpeneClick}
          isDark={isDark}
        />
        
        {/* Terpene legends and descriptions */}
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
