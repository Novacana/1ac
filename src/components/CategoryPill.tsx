
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Cannabis, 
  Droplet, 
  Cookie, 
  Cigarette, 
  ShoppingBag,
  Pill,
  Leaf,
  Pipette,
  BookOpen,
  Package2,
  Home,
  Layers3
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
    case "Blüten":
      return <Cannabis className="h-4 w-4" />;
    case "Oils":
    case "Öle":
      return <Pipette className="h-4 w-4" />;
    case "Edibles":
      return <Cookie className="h-4 w-4" />;
    case "Topicals":
      return <Droplet className="h-4 w-4" />;
    case "Vapes":
      return <Cigarette className="h-4 w-4" />;
    case "Accessories":
    case "Zubehör":
      return <ShoppingBag className="h-4 w-4" />;
    case "CBD":
      return <Leaf className="h-4 w-4" />;
    case "Medical":
    case "Medizinisch":
      return <Pill className="h-4 w-4" />;
    case "Books":
    case "Bücher":
      return <BookOpen className="h-4 w-4" />;
    case "All":
      return <Layers3 className="h-4 w-4" />;
    case "Other":
      return <Package2 className="h-4 w-4" />;
    default:
      return <Cannabis className="h-4 w-4" />;
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
        "hover:shadow-md aspect-square p-3", 
        active && "font-medium",
        className
      )}
      style={style}
      title={label}
      aria-label={label}
    >
      {icon}
    </Button>
  );
};

export default CategoryPill;
