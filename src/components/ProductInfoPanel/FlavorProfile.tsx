
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
              className="flex items-center justify-center rounded-full w-10 h-10 text-foreground dark:text-foreground"
              style={{ 
                backgroundColor: bgColor,
                // Add a subtle shadow for better visibility in dark mode
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
              }}
              title={flavor}
            >
              {icon}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlavorProfile;
