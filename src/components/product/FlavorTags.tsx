
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FlavorTagsProps {
  flavors?: string[];
}

const FlavorTags: React.FC<FlavorTagsProps> = ({ flavors }) => {
  const { t } = useLanguage();

  if (!flavors || flavors.length === 0) return null;

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
    <div className="mb-3">
      <h4 className="text-xs font-medium mb-1">{t("taste_profile")}</h4>
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
            {translateFlavor(flavor)}
          </span>
        ))}
      </div>
    </div>
  );
};

export default FlavorTags;
