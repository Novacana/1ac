
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Flower2, Droplet, Cookie, Cigarette, ShoppingBag } from "lucide-react";

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
      return <Droplet className="h-4 w-4" />; // Changed from Spray to Droplet for Topicals
    case "Vapes":
      return <Cigarette className="h-4 w-4" />;
    case "Accessories":
      return <ShoppingBag className="h-4 w-4" />;
    default:
      return null;
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
        "rounded-full transition-all duration-200 whitespace-nowrap",
        "hover:shadow-md min-w-fit p-2",
        active && "font-medium",
        className
      )}
      style={style}
      title={label} // Added title attribute for accessibility
    >
      {icon}
    </Button>
  );
};

export default CategoryPill;
