
import React, { useEffect, useState, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProductInfoPanelProps {
  product: Product | null;
}

const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({ product }) => {
  const [thcProgress, setThcProgress] = useState(0);
  const [cbdProgress, setCbdProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { t, language } = useLanguage();

  // Parse THC and CBD values
  const parsePercentage = (value: string | undefined) => {
    if (!value) return 0;
    const match = value.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[0]) : 0;
  };

  const thcValue = parsePercentage(product?.thc);
  const cbdValue = parsePercentage(product?.cbd);

  // Animate progress bars when component mounts
  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setThcProgress(thcValue);
      setCbdProgress(cbdValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [thcValue, cbdValue]);

  // Early return if no product
  if (!product) return null;

  // Create terpene data for the pie chart
  const terpeneData = product.terpenes?.map((terpene, index) => ({
    name: terpene.name,
    value: parsePercentage(terpene.percentage),
    color: getTerpeneColor(terpene.name)
  })) || [];

  // Function to get appropriate background color for flavor tags
  const getFlavorColor = (flavor: string): string => {
    const colorMap: Record<string, string> = {
      'Earthy': '#FDE1D3', // Soft Peach
      'Pine': '#F2FCE2',   // Soft Green
      'Sweet': '#FEF7CD',  // Soft Yellow
      'Citrus': '#FEC6A1', // Soft Orange
      'Tropical': '#FEC6A1', // Soft Orange
      'Herbal': '#F2FCE2', // Soft Green
      'Nutty': '#FDE1D3',  // Soft Peach
      'Menthol': '#D3E4FD', // Soft Blue
      'Eucalyptus': '#D3E4FD', // Soft Blue
      'Clean': '#D3E4FD',  // Soft Blue
      'Mango': '#FEC6A1',  // Soft Orange
      'Strawberry': '#FFDEE2', // Soft Pink
      'Watermelon': '#FFDEE2', // Soft Pink
      'Blueberry': '#D3E4FD', // Soft Blue
      'Natural': '#F2FCE2', // Soft Green
      'Erdig': '#FDE1D3', // Soft Peach
      'Kiefer': '#F2FCE2',   // Soft Green
      'Süß': '#FEF7CD',  // Soft Yellow
      'Zitrus': '#FEC6A1', // Soft Orange
      'Tropisch': '#FEC6A1', // Soft Orange
      'Kräuterig': '#F2FCE2', // Soft Green
      'Nussig': '#FDE1D3',  // Soft Peach
      'Eukalyptus': '#D3E4FD', // Soft Blue
      'Rein': '#D3E4FD',  // Soft Blue
      'Erdbeere': '#FFDEE2', // Soft Pink
      'Wassermelone': '#FFDEE2', // Soft Pink
      'Blaubeere': '#D3E4FD', // Soft Blue
      'Natürlich': '#F2FCE2', // Soft Green
    };
    
    return colorMap[flavor] || '#F2FCE2'; // Default to soft green if no match
  };

  // Übersetze Flavor-Text je nach ausgewählter Sprache
  const translateFlavor = (flavor: string): string => {
    return t(flavor) || flavor;
  };

  return (
    <div 
      className={cn(
        "absolute top-4 left-4 z-10 bg-background/80 backdrop-blur-md rounded-lg p-4 shadow-lg border border-primary/20",
        "w-64 max-w-[calc(100%-2rem)] transition-all duration-500",
        "lg:w-72",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}
    >
      <h3 className="text-sm font-medium mb-2 text-primary truncate">{product.name}</h3>
      
      {/* Cannabinoid Profile - Now at the top */}
      <div className="mb-3">
        <h4 className="text-xs font-medium mb-1">{t("cannabinoid_profile")}</h4>
        <div className="space-y-2">
          {product.thc && (
            <div>
              <div className="flex justify-between text-xs mb-0.5">
                <span>THC</span>
                <span className="font-medium">{product.thc}</span>
              </div>
              <Progress 
                value={thcProgress * 4} 
                max={100} 
                className="h-1.5 bg-primary/10"
              />
            </div>
          )}
          
          {product.cbd && (
            <div>
              <div className="flex justify-between text-xs mb-0.5">
                <span>CBD</span>
                <span className="font-medium">{product.cbd}</span>
              </div>
              <Progress 
                value={cbdProgress * 6.6} 
                max={100} 
                className="h-1.5 bg-primary/10"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Taste/Flavor Profile - New section in the middle */}
      {product.flavors && product.flavors.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-medium mb-1">{t("taste_profile")}</h4>
          <div className="flex flex-wrap gap-1">
            {product.flavors.map((flavor, index) => (
              <span 
                key={index} 
                className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                style={{ 
                  backgroundColor: getFlavorColor(flavor),
                  color: 'rgba(0, 0, 0, 0.7)'
                }}
              >
                {translateFlavor(flavor)}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {/* Quick info tags */}
      <div className="flex flex-wrap gap-1 mb-3">
        {product.strain && (
          <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full">
            {product.strain}
          </span>
        )}
        <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full">
          {product.category}
        </span>
      </div>
      
      {/* Terpene Profile - Now at the bottom */}
      {terpeneData.length > 0 && (
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
      )}
    </div>
  );
};

// Helper function to get colors for different terpenes
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

export default ProductInfoPanel;
