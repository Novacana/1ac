
import React from "react";
import { getFlavorColor } from "./utils";
import { 
  Cherry, 
  Grape, 
  Citrus, 
  Apple, 
  Cookie, 
  Leaf, 
  Coffee, 
  Wheat,
  Candy,
  IceCream,
  TreePine
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

interface FlavorProfileProps {
  flavors?: string[];
}

// Function to get appropriate icon for each flavor
const getFlavorIcon = (flavor: string) => {
  switch (flavor) {
    case "Süß":
    case "Sweet":
      return <Candy className="h-4 w-4" />;
    case "Beere":
    case "Berry":
      return <Cherry className="h-4 w-4" />;
    case "Zitrus":
    case "Citrus":
      return <Citrus className="h-4 w-4" />;
    case "Trauben":
    case "Grape":
      return <Grape className="h-4 w-4" />;
    case "Erdig":
    case "Earthy":
      return <Wheat className="h-4 w-4" />;
    case "Kiefer":
    case "Pine":
      return <TreePine className="h-4 w-4" />;
    case "Würzig":
    case "Spicy":
      return <Coffee className="h-4 w-4" />;
    case "Dessert":
      return <IceCream className="h-4 w-4" />;
    case "Fruchtig":
    case "Fruity":
      return <Apple className="h-4 w-4" />;
    case "Kräuter":
    case "Herbal":
      return <Leaf className="h-4 w-4" />;
    case "Haze":
    case "Holzig":
    case "Woody":
      return <Wheat className="h-4 w-4" />;
    case "Haschartig":
    case "Hashy":
      return <Cookie className="h-4 w-4" />;
    default:
      return <Leaf className="h-4 w-4" />; // Default icon
  }
};

const FlavorProfile: React.FC<FlavorProfileProps> = ({ flavors }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  
  if (!flavors || flavors.length === 0) return null;
  
  return (
    <div>
      <h4 className="text-xs font-medium mb-1.5">Geschmack</h4>
      <div className="flex flex-wrap gap-2">
        {flavors.map((flavor, index) => {
          const icon = getFlavorIcon(flavor);
          const bgColor = getFlavorColor(flavor);
          
          return (
            <div 
              key={index} 
              className="relative group"
            >
              <div
                className={`flex items-center justify-center rounded-full w-10 h-10 ${isDarkMode ? 'text-white' : 'text-foreground'}`}
                style={{ 
                  backgroundColor: bgColor,
                  boxShadow: isDarkMode 
                    ? 'inset 0 0 0 1px rgba(255,255,255,0.2), 0 0 5px rgba(255,255,255,0.1)' 
                    : 'inset 0 0 0 1px rgba(255,255,255,0.1)'
                }}
              >
                {icon}
              </div>
              
              {/* Tooltip with flavor name */}
              <span 
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 
                  px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 group-hover:opacity-100 
                  pointer-events-none transition-opacity whitespace-nowrap z-10"
              >
                {flavor}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlavorProfile;
