
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    console.log("ProductCard image loaded:", image);
    setIsLoaded(true);
  };

  const handleImageError = () => {
    console.error("ProductCard image error:", image);
    setImageError(true);
    // Versuchen, ein alternatives Bild zu laden oder ein Platzhalterbild zu verwenden
    setIsLoaded(true);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to product page
    e.stopPropagation(); // Stop event from bubbling up
    toast.success(`${name} wurde zum Warenkorb hinzugefügt`);
    console.log(`Added ${name} to cart`);
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
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-sm text-muted-foreground">Bild nicht verfügbar</span>
          </div>
        ) : (
          <img
            src={image}
            alt={name}
            className={cn(
              "w-full h-full object-cover transition-all duration-700 ease-out",
              isLoaded ? "opacity-100" : "opacity-0",
              isHovered ? "scale-105" : "scale-100"
            )}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
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
        
        {/* Add to cart button in the top right corner */}
        <Button
          variant="default"
          size="icon"
          className="absolute top-16 right-3 z-10 rounded-full shadow-md scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-200"
          onClick={handleAddToCart}
          title="Zum Warenkorb hinzufügen"
        >
          <ShoppingCart className="h-4 w-4" />
        </Button>
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
          onClick={handleAddToCart}
        >
          <ShoppingCart className="h-4 w-4 mr-2 transition-transform duration-300 group-hover/btn:scale-110" />
          Zum Warenkorb
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 transition-all duration-300"
          asChild
        >
          <Link to={`/product/${id}`}>
            <MoveRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            <span className="sr-only">Details anzeigen</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
