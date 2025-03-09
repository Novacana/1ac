
import React from "react";
import { getFlavorColor } from "./utils";
import { 
  Circle, 
  Droplet, 
  CircleDot,
  Info
} from "lucide-react";

interface FlavorProfileProps {
  flavors?: string[];
}

// Function to get appropriate icon for each flavor
const getFlavorIcon = (flavor: string) => {
  switch (flavor.toLowerCase()) {
    case "süß":
    case "sweet":
      return <CircleDot className="h-4 w-4" />;
    case "beere":
    case "berry":
      return <CircleDot className="h-4 w-4" />;
    case "zitrus":
    case "citrus":
      return <Droplet className="h-4 w-4" />;
    case "trauben":
    case "grape":
      return <CircleDot className="h-4 w-4" />;
    case "erdig":
    case "earthy":
      return <Circle className="h-4 w-4" />;
    case "kiefer":
    case "pine":
      return <Droplet className="h-4 w-4" />;
    case "würzig":
    case "spicy":
      return <Droplet className="h-4 w-4" />;
    case "dessert":
      return <CircleDot className="h-4 w-4" />;
    case "fruchtig":
    case "fruity":
      return <Droplet className="h-4 w-4" />;
    case "kräuter":
    case "herbal":
      return <Droplet className="h-4 w-4" />;
    case "haze":
    case "holzig":
    case "woody":
      return <Circle className="h-4 w-4" />;
    case "haschartig":
    case "hashy":
      return <Circle className="h-4 w-4" />;
    default:
      return <Circle className="h-4 w-4" />; // Default icon
  }
};

const FlavorProfile: React.FC<FlavorProfileProps> = ({ flavors }) => {
  if (!flavors || flavors.length === 0) return null;
  
  return (
    <div>
      <div className="flex items-center mb-1.5">
        <h4 className="text-xs font-medium">Geschmack</h4>
        <Info className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
      </div>
      <div className="flex flex-wrap gap-2">
        {flavors.map((flavor, index) => {
          const icon = getFlavorIcon(flavor);
          const bgColor = getFlavorColor(flavor);
          
          return (
            <div 
              key={index} 
              className="flex items-center gap-1.5 px-2 py-1 rounded-md text-foreground dark:text-foreground text-xs"
              style={{ 
                backgroundColor: bgColor,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
              }}
              title={flavor}
            >
              {icon}
              <span>{flavor}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FlavorProfile;
