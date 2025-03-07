
import React from "react";
import { getFlavorColor } from "./utils";

interface FlavorProfileProps {
  flavors?: string[];
}

const FlavorProfile: React.FC<FlavorProfileProps> = ({ flavors }) => {
  if (!flavors || flavors.length === 0) return null;
  
  return (
    <div className="mb-3">
      <h4 className="text-xs font-medium mb-1">Geschmacksprofil</h4>
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

export default FlavorProfile;
