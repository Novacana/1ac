
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product";
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  imagePath: string;
  imagesLoaded: {[key: string]: boolean};
  setImagesLoaded: React.Dispatch<React.SetStateAction<{[key: string]: boolean}>>;
}

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

  return (
    <Link key={product.id} to={`/product/${product.id}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardContent className="p-0">
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
              className="w-full h-full object-cover z-0"
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
            {product.thc && (
              <div className="absolute top-2 right-2 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 backdrop-blur-sm">
                <span>THC: {product.thc}</span>
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-sm mb-0.5 line-clamp-1">{product.name}</h3>
            <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
            
            <div className="flex justify-between items-center mt-2">
              <p className="font-medium text-sm">{product.price.toFixed(2)} €</p>
              <p className="text-xs text-muted-foreground">{packageSize}</p>
            </div>
            
            <div className={cn(
              "flex items-center text-xs gap-1 mt-1",
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
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
