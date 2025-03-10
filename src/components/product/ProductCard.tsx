
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product";
import { CheckCircle, XCircle, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getFlavorColor } from "@/components/ProductInfoPanel/utils";
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
  IceCream,
  TreePine
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  imagePath: string;
  imagesLoaded: {[key: string]: boolean};
  setImagesLoaded: React.Dispatch<React.SetStateAction<{[key: string]: boolean}>>;
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
      return <TreePine className="h-3 w-3" />;
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

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  imagePath,
  imagesLoaded,
  setImagesLoaded
}) => {
  // Force loader to disappear after a timeout as a fallback
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!imagesLoaded[product.id]) {
        console.log(`Force removing loader for ${product.name} after timeout`);
        setImagesLoaded(prev => ({...prev, [product.id]: true}));
      }
    }, 3000); // 3 second timeout
    
    return () => clearTimeout(timeoutId);
  }, [product.id, imagesLoaded, setImagesLoaded, product.name]);

  // Default package size if not specified
  const packageSize = product.weight || "10g";
  
  // Determine availability (in a real app, this would come from inventory data)
  const isAvailable = true; // Default to available for now

  // Generate random rating for display purposes (in a real app, this would come from actual ratings)
  const rating = (4 + Math.random()).toFixed(1);

  // Generate a random delivery time (in a real app, this would be calculated based on logistics)
  const deliveryDays = Math.floor(Math.random() * 3) + 1;
  
  // Colors for flavor icons
  const colors = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#10B981', '#EF4444'];

  return (
    <Link key={product.id} to={`/product/${product.id}`}>
      <Card className="h-full transition-all hover:shadow-lg hover:scale-[1.02] bg-card/80 backdrop-blur-sm border-border/40">
        <CardContent className="p-0 h-full relative flex flex-col">
          {/* Image section */}
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <div 
              className="absolute inset-0 bg-card/20 flex items-center justify-center z-10 transition-opacity duration-300" 
              style={{opacity: imagesLoaded[product.id] ? 0 : 1}}
            >
              <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
            </div>
            <img 
              src={imagePath}
              alt={product.name}
              className="w-full h-full object-cover z-0 transition-transform duration-300 group-hover:scale-105"
              onLoad={() => {
                console.log(`Image loaded successfully for ${product.name}`);
                setImagesLoaded(prev => ({...prev, [product.id]: true}));
              }}
              onError={(e) => {
                console.error(`Error loading image for ${product.name}:`, e.currentTarget.src);
                (e.target as HTMLImageElement).src = "/placeholder.svg";
                setImagesLoaded(prev => ({...prev, [product.id]: true}));
              }}
            />
            
            {/* THC badge */}
            {product.thc && (
              <div className="absolute top-2 right-2 bg-green-500/80 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-md">
                <span>THC: {product.thc}</span>
              </div>
            )}
            
            {/* Category badge - only on desktop */}
            {product.category && (
              <div className="absolute top-2 left-2 hidden md:block">
                <Badge variant="secondary" className="text-xs bg-black/50 text-white backdrop-blur-md">
                  {product.category}
                </Badge>
              </div>
            )}
          </div>
          
          {/* Content section */}
          <div className="p-3 flex flex-col flex-grow">
            <div className="flex-grow">
              <h3 className="font-semibold text-sm md:text-base mb-0.5 line-clamp-1">{product.name}</h3>
              <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{product.strain || product.category}</p>
              
              {/* Flavor visualization - show on both mobile and desktop */}
              {product.flavors && product.flavors.length > 0 && (
                <div className="flex flex-wrap gap-1.5 my-2">
                  {product.flavors.slice(0, 3).map((flavor, index) => {
                    const bgColor = getFlavorColor(flavor);
                    const icon = getFlavorIcon(flavor);
                    
                    return (
                      <div 
                        key={index} 
                        className="relative group"
                      >
                        <div
                          className="flex items-center justify-center rounded-full w-6 h-6 
                                    transition-transform hover:scale-110
                                    border border-white/30 dark:border-white/10"
                          style={{ backgroundColor: bgColor }}
                        >
                          {icon}
                        </div>
                        
                        {/* Tooltip with flavor name */}
                        <span 
                          className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 
                                   px-1.5 py-0.5 bg-popover text-popover-foreground text-[10px] rounded-sm opacity-0 group-hover:opacity-100 
                                   pointer-events-none transition-opacity whitespace-nowrap z-10 border border-border/50"
                          style={{ backdropFilter: 'blur(8px)' }}
                        >
                          {flavor}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Rating - only visible on desktop */}
              <div className="flex items-center gap-1 text-amber-400 my-1 hidden md:flex">
                <Star className="fill-amber-400 h-3 w-3" />
                <span className="text-xs font-medium">{rating}</span>
                <span className="text-xs text-muted-foreground">({Math.floor(Math.random() * 100) + 10})</span>
              </div>
            </div>
            
            {/* Price and package size */}
            <div className="flex justify-between items-center mt-auto">
              <p className="font-medium">{product.price.toFixed(2)} €</p>
              <p className="text-xs text-muted-foreground">{packageSize}</p>
            </div>
            
            {/* Availability indicator */}
            <div className="flex items-center justify-between mt-1">
              <div className={cn(
                "flex items-center text-xs gap-1",
                isAvailable ? "text-green-600" : "text-red-500"
              )}>
                {isAvailable ? (
                  <>
                    <CheckCircle className="h-3 w-3" />
                    <span>Verfügbar</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    <span>Nicht verfügbar</span>
                  </>
                )}
              </div>
              
              {/* Delivery time - only visible on desktop */}
              <div className="text-xs flex items-center gap-1 text-muted-foreground hidden md:flex">
                <Clock className="h-3 w-3" />
                <span>Lieferung in {deliveryDays} {deliveryDays === 1 ? 'Tag' : 'Tagen'}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
