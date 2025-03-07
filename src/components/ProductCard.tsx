
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  thc?: string;
  cbd?: string;
  category: string;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  thc,
  cbd,
  category,
  className
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden border-border/40 transition-all duration-300 h-full",
        "hover:border-primary/30 hover:shadow-md hover:shadow-primary/5",
        "group animate-scale-in",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${id}`} className="block relative aspect-square overflow-hidden">
        <div className="absolute inset-0 bg-card/20 backdrop-blur-sm flex items-center justify-center z-0">
          {!isLoaded && (
            <div className="h-12 w-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
          )}
        </div>
        <img
          src={image}
          alt={name}
          className={cn(
            "w-full h-full object-cover transition-all duration-700 ease-out",
            isLoaded ? "opacity-100" : "opacity-0",
            isHovered ? "scale-105" : "scale-100"
          )}
          onLoad={handleImageLoad}
        />
        <div className="absolute inset-x-0 top-4 flex justify-between px-4">
          <span className="bg-background/80 backdrop-blur-sm text-xs px-3 py-1 rounded-full">
            {category}
          </span>
          
          {(thc || cbd) && (
            <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full backdrop-blur-sm">
              {thc && `THC: ${thc}`}
              {thc && cbd && " | "}
              {cbd && `CBD: ${cbd}`}
            </span>
          )}
        </div>
      </Link>
      
      <CardContent className="p-4">
        <h3 className="font-medium text-lg line-clamp-1 group-hover:text-primary transition-colors duration-200">
          {name}
        </h3>
        <p className="font-bold text-lg mt-1">€{price.toFixed(2)}</p>
      </CardContent>
      
      <CardFooter className="px-4 pb-4 pt-0 flex justify-between gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="w-full transition-all duration-300 group/btn"
        >
          <ShoppingCart className="h-4 w-4 mr-2 transition-transform duration-300 group-hover/btn:scale-110" />
          Add to Cart
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 transition-all duration-300"
          asChild
        >
          <Link to={`/product/${id}`}>
            <MoveRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            <span className="sr-only">View details</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
