
import React from "react";
import { 
  Flower2, 
  Droplet, 
  Cookie, 
  Cigarette, 
  ShoppingBag,
  Pipette
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductTagsProps {
  strain?: string;
  category: string;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Flowers":
      return <Flower2 className="h-3 w-3" />;
    case "Oils":
      return <Pipette className="h-3 w-3" />; // Swapped: now using Pipette (toothpaste tube) for Oils
    case "Edibles":
      return <Cookie className="h-3 w-3" />;
    case "Topicals":
      return <Droplet className="h-3 w-3" />; // Swapped: now using Droplet for Topicals
    case "Vapes":
      return <Cigarette className="h-3 w-3" />;
    case "Accessories":
      return <ShoppingBag className="h-3 w-3" />;
    default:
      return null;
  }
};

const ProductTags: React.FC<ProductTagsProps> = ({ strain, category }) => {
  const categoryIcon = getCategoryIcon(category);
  
  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {strain && (
        <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
          {strain}
        </span>
      )}
      <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-full flex items-center gap-1">
        {categoryIcon}
        <span className="text-[10px]">{category}</span>
      </span>
    </div>
  );
};

export default ProductTags;
