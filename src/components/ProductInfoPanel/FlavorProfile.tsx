
import React from "react";

interface FlavorProfileProps {
  flavors?: string[];
}

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
  };
  
  return colorMap[flavor] || '#F2FCE2'; // Default to soft green if no match
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
