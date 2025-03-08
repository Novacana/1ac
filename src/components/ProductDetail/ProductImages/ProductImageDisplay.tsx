
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductImageDisplayProps {
  fixedImages: string[];
  selectedImage: number;
  name: string;
  productId: string;
  productPrice: number;
}

const ProductImageDisplay: React.FC<ProductImageDisplayProps> = ({
  fixedImages,
  selectedImage,
  name,
  productId,
  productPrice
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const isMobile = useIsMobile();

  const handleAddToCart = () => {
    addToCart({
      id: productId,
      name: name,
      price: productPrice,
      image: fixedImages[selectedImage],
      quantity: 1,
    });
    toast.success(`${name} wurde zum Warenkorb hinzugefügt`);
  };

  return (
    <div 
      className="relative overflow-hidden rounded-lg border border-border/40 bg-card max-w-md mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          "absolute inset-0 bg-card/20 backdrop-blur-sm flex items-center justify-center z-10 transition-opacity duration-300",
          isImageLoaded ? "opacity-0" : "opacity-100"
        )}
      >
        <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin"></div>
      </div>
      {fixedImages && fixedImages.length > 0 ? (
        <>
          <img
            src={fixedImages[selectedImage]}
            alt={name}
            className={cn(
              "w-full h-auto object-contain transition-opacity duration-500 z-0 p-4",
              isImageLoaded ? "opacity-100" : "opacity-0"
            )}
            style={{ maxHeight: "400px" }}
            onLoad={() => {
              console.log(`Main image loaded successfully:`, fixedImages[selectedImage]);
              setIsImageLoaded(true);
            }}
            onError={(e) => {
              console.error("Fehler beim Laden des Bildes:", e, "Quelle:", fixedImages[selectedImage]);
              toast.error(`Hauptbild konnte nicht geladen werden`);
              (e.target as HTMLImageElement).src = "/placeholder.svg";
              setIsImageLoaded(true);
            }}
          />
          
          {/* Add to cart button overlay - only on mobile */}
          {isMobile && (
            <div 
              className={cn(
                "absolute bottom-4 left-0 right-0 flex justify-center items-center transition-opacity duration-300 z-20",
                isHovered || isImageLoaded ? "opacity-100" : "opacity-0"
              )}
            >
              <Button 
                onClick={handleAddToCart}
                size="sm"
                className="bg-primary/90 hover:bg-primary shadow-md"
              >
                <ShoppingCart size={16} className="mr-2" />
                In den Warenkorb
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          Kein Bild verfügbar
        </div>
      )}
    </div>
  );
};

export default ProductImageDisplay;
