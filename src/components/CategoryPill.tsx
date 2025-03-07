
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Flower2, 
  Droplet, 
  Cookie, 
  Cigarette, 
  ShoppingBag,
  Pill,
  Leaf,
  Palette,
  BookOpen
} from "lucide-react";

export interface CategoryPillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Flowers":
      return <Flower2 className="h-4 w-4" />;
    case "Oils":
      return <Droplet className="h-4 w-4" />;
    case "Edibles":
      return <Cookie className="h-4 w-4" />;
    case "Topicals":
      return <Palette className="h-4 w-4" />; // Changed to Palette for better representation
    case "Vapes":
      return <Cigarette className="h-4 w-4" />;
    case "Accessories":
      return <ShoppingBag className="h-4 w-4" />;
    case "CBD":
      return <Leaf className="h-4 w-4" />;
    case "Medical":
      return <Pill className="h-4 w-4" />;
    case "Books":
      return <BookOpen className="h-4 w-4" />;
    default:
      return <Flower2 className="h-4 w-4" />; // Default to Flower2 if no match
  }
};

const CategoryPill: React.FC<CategoryPillProps> = ({
  label,
  active = false,
  onClick,
  className,
  style
}) => {
  const icon = getCategoryIcon(label);

  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={cn(
        "rounded-full transition-all duration-200",
        "hover:shadow-md aspect-square p-3", // Changed to aspect-square and p-3 for uniform circles
        active && "font-medium",
        className
      )}
      style={style}
      title={label} // Added title attribute for accessibility
      aria-label={label} // Added aria-label for accessibility
    >
      {icon}
    </Button>
  );
};

export default CategoryPill;
