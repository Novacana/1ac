
import React from "react";
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

  return (
    <div className="w-full">
      <TerpeneTotal totalPercentage={totalPercentage} />
      
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-3`}>
        {/* The egg visualization - properly sized */}
        <div className="flex-1">
          <TerpeneVisualization 
            terpeneData={terpeneData} 
            expandedTerpene={null} // Always pass null since we don't expand anymore
            onTerpeneClick={() => {}} // Empty function since we removed click functionality
            isDark={isDark}
          />
        </div>
        
        {/* Terpene legends and descriptions */}
        <div className="flex-1">
          <TerpeneLegend 
            terpeneData={terpeneData} 
            expandedTerpene={null} // Always pass null since we don't expand anymore
            onTerpeneClick={() => {}} // Empty function since we removed click functionality
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
};

export default TerpeneEgg;
