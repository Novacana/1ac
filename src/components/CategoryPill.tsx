
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CategoryPillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const CategoryPill: React.FC<CategoryPillProps> = ({
  label,
  active = false,
  onClick,
  className,
  style
}) => {
  return (
    <Button
      variant={active ? "default" : "outline"}
      size="sm"
      onClick={onClick}
      className={cn(
        "rounded-full transition-all duration-200 whitespace-nowrap",
        "hover:shadow-md min-w-fit",
        active && "font-medium",
        className
      )}
      style={style}
    >
      {label}
    </Button>
  );
};

export default CategoryPill;
