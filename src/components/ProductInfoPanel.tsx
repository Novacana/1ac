
import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductInfoPanelProps {
  product: Product | null;
}

const ProductInfoPanel: React.FC<ProductInfoPanelProps> = ({ product }) => {
  const [thcProgress, setThcProgress] = useState(0);
  const [cbdProgress, setCbdProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

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
      // German flavor names
      'Erdig': '#FDE1D3',
      'Kiefer': '#F2FCE2',
      'Süß': '#FEF7CD',
      'Zitrus': '#FEC6A1',
      'Tropisch': '#FEC6A1',
      'Kräuter': '#F2FCE2',
      'Nussig': '#FDE1D3',
      'Würzig': '#FDE1D3',
      'Holzig': '#A0522D',
      'Trauben': '#D3E4FD',
      'Beere': '#FFDEE2',
      'Haze': '#F2FCE2',
      'Dessert': '#FEF7CD',
      'Haschartig': '#A0522D',
      'Kräutrig': '#F2FCE2',
    };
    
    return colorMap[flavor] || '#F2FCE2'; // Default to soft green if no match
  };

  return (
    <div 
      className={cn(
        "rounded-lg p-4 transition-all duration-500",
        "md:absolute md:top-4 md:left-4 md:z-10 md:w-72 md:max-w-[calc(100%-2rem)]",
        "bg-white/80 dark:bg-black/60 backdrop-blur-md border border-primary/10",
        "w-full mx-auto max-w-sm", // Mobile styling
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
      )}
    >
      <h3 className="text-sm font-medium mb-2 text-primary truncate">{product.name}</h3>
      
      {/* Cannabinoid Profile */}
      <div className="mb-3">
        <h4 className="text-xs font-medium mb-1">Cannabinoid-Profil</h4>
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
      
      {/* Taste/Flavor Profile */}
      {product.flavors && product.flavors.length > 0 && (
        <div className="mb-3">
          <h4 className="text-xs font-medium mb-1">Geschmacksprofil</h4>
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
                {flavor}
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
      
      {/* Terpene Profile */}
      {terpeneData.length > 0 && (
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
      )}
    </div>
  );
};

// Helper function to get colors for different terpenes
const getTerpeneColor = (terpene: string): string => {
  const colors: Record<string, string> = {
    'Myrcen': '#3a9a40',
    'Limonen': '#ffbb00',
    'Limonene': '#ffbb00',
    'Caryophyllen': '#ff5733',
    'Caryophyllene': '#ff5733',
    'Pinen': '#00a86b',
    'Pinene': '#00a86b',
    'Linalool': '#8a2be2',
    'Terpinolen': '#4682b4',
    'Terpinolene': '#4682b4',
    'Ocimen': '#ff4500',
    'Ocimene': '#ff4500',
    'Humulen': '#a0522d',
    'Humulene': '#a0522d',
    'Bisabolol': '#d8bfd8'
  };
  
  return colors[terpene] || '#' + Math.floor(Math.random()*16777215).toString(16);
};

export default ProductInfoPanel;
