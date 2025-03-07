
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
  IceCream
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FlavorProfileProps {
  flavors?: string[];
}

// Function to get appropriate icon for each flavor
const getFlavorIcon = (flavor: string) => {
  switch (flavor) {
    case "Süß":
    case "Sweet":
      return <Candy className="h-3 w-3" />;
    case "Beere":
    case "Berry":
      return <Cherry className="h-3 w-3" />;
    case "Zitrus":
    case "Citrus":
      return <Citrus className="h-3 w-3" />;
    case "Trauben":
    case "Grape":
      return <Grape className="h-3 w-3" />;
    case "Erdig":
    case "Earthy":
      return <Wheat className="h-3 w-3" />;
    case "Kiefer":
    case "Pine":
      return <Leaf className="h-3 w-3" />;
    case "Würzig":
    case "Spicy":
      return <Coffee className="h-3 w-3" />;
    case "Dessert":
      return <IceCream className="h-3 w-3" />;
    case "Fruchtig":
    case "Fruity":
      return <Apple className="h-3 w-3" />;
    case "Kräuter":
    case "Herbal":
      return <Leaf className="h-3 w-3" />;
    case "Haze":
    case "Holzig":
    case "Woody":
      return <Wheat className="h-3 w-3" />;
    case "Haschartig":
    case "Hashy":
      return <Cookie className="h-3 w-3" />;
    default:
      return <Leaf className="h-3 w-3" />; // Default icon
  }
};

const FlavorProfile: React.FC<FlavorProfileProps> = ({ flavors }) => {
  if (!flavors || flavors.length === 0) return null;
  
  return (
    <div className="mb-3">
      <h4 className="text-xs font-medium mb-1">Geschmacksprofil</h4>
      <div className="flex flex-wrap gap-2">
        {flavors.map((flavor, index) => {
          const icon = getFlavorIcon(flavor);
          return (
            <span 
              key={index} 
              className="px-2 py-2 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: getFlavorColor(flavor),
                color: 'rgba(0, 0, 0, 0.7)'
              }}
              title={flavor} // Add title for hover tooltip
            >
              {icon}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default FlavorProfile;
