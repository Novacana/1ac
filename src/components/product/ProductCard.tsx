
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/types/product";

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

  return (
    <Link key={product.id} to={`/product/${product.id}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white border-border/20">
        <CardContent className="p-0 overflow-hidden rounded-lg">
          <div className="aspect-square relative overflow-hidden rounded-t-lg">
            <div 
              className="absolute inset-0 bg-card/20 flex items-center justify-center z-10 transition-opacity duration-300" 
              style={{opacity: imagesLoaded[product.id] ? 0 : 1}}
            >
              <div className="h-10 w-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
            </div>
            <img 
              src={imagePath}
              alt={product.name}
              className="w-full h-full object-cover z-0 transition-transform duration-500 hover:scale-110"
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
              <div className="absolute top-2 right-2 bg-primary/80 text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm shadow-sm">
                THC: {product.thc}
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-base mb-1 line-clamp-1 text-foreground">{product.name}</h3>
            <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
            <div className="flex justify-between items-center">
              <p className="font-bold text-primary text-lg">{product.price?.toFixed(2)} €</p>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">10g</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
