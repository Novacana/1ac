
import React from "react";

interface FlavorProfileProps {
  flavors?: string[];
}

const getFlavorColor = (flavor: string): string => {
  const colorMap: Record<string, string> = {
    'Earthy': '#FDE1D3',
    'Pine': '#F2FCE2',
    'Sweet': '#FEF7CD',
    'Citrus': '#FEC6A1',
    'Tropical': '#FEC6A1',
    'Herbal': '#F2FCE2',
    'Nutty': '#FDE1D3',
    'Menthol': '#D3E4FD',
    'Eucalyptus': '#D3E4FD',
    'Clean': '#D3E4FD',
    'Mango': '#FEC6A1',
    'Strawberry': '#FFDEE2',
    'Watermelon': '#FFDEE2',
    'Blueberry': '#D3E4FD',
    'Natural': '#F2FCE2',
  };
  
  return colorMap[flavor] || '#F2FCE2';
};

export const FlavorProfile: React.FC<FlavorProfileProps> = ({ flavors }) => {
  if (!flavors || flavors.length === 0) return null;

  return (
    <div className="mb-3">
      <h4 className="text-xs font-medium mb-1">Taste Profile</h4>
      <div className="flex flex-wrap gap-1">
        {flavors.map((flavor, index) => (
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
  );
};
